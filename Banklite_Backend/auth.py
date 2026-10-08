from flask import Blueprint, request
from utils import verify_password, generate_token, format_response, validate_email
from database import execute_query
from config import error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    body = request.get_json() or {}
    email = body.get('email', '').strip()
    password = body.get('password', '').strip()

    if not email or not password:
        return error_response('Email and password are required', 400)

    if not validate_email(email):
        return error_response('Invalid email format', 400)

    user = execute_query('SELECT * FROM users WHERE email = %s', (email,), fetch_one=True)
    if not user:
        return error_response('Invalid email or password', 401)

    if not verify_password(password, user['password_hash']):
        return error_response('Invalid email or password', 401)

    token = generate_token()
    update_query = 'UPDATE users SET session_token = %s WHERE id = %s'
    execute_query(update_query, (token, user['id']), commit=True)

    data = {
        'token': token,
        'role': user['role'],
        'full_name': user['full_name'],
        'email': user['email'],
    }

    return format_response(True, data, 'Login successful'), 200
