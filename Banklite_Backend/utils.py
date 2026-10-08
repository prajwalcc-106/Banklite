import re
import uuid
import random
from werkzeug.security import generate_password_hash, check_password_hash
from database import execute_query


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)


def generate_token() -> str:
    return str(uuid.uuid4())


def validate_email(email: str) -> bool:
    pattern = r'^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def get_user_from_token(token: str):
    if not token:
        return None
    query = 'SELECT * FROM users WHERE session_token = %s'
    return execute_query(query, (token,), fetch_one=True)


def calculate_credit_score() -> int:
    return random.randint(300, 850)


def format_response(success: bool, data=None, message='') -> dict:
    return {
        'success': success,
        'data': data or {},
        'message': message,
    }


def validate_positive_number(value):
    try:
        number = float(value)
        return number > 0
    except (ValueError, TypeError):
        return False
