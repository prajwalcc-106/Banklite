from flask import Blueprint, request
from utils import (
    validate_positive_number,
    format_response,
    get_user_from_token,
    calculate_credit_score,
)
from database import execute_query
from config import error_response

loans_bp = Blueprint('loans', __name__, url_prefix='/api/v1/loans')


def get_authorized_user():
    auth_header = request.headers.get('Authorization', '').strip()
    if not auth_header:
        return None
    return get_user_from_token(auth_header)


@loans_bp.route('/apply', methods=['POST'])
def apply_loan():
    print(">>> APPLY LOAN CALLED <<<")
    user = get_authorized_user()
    if not user:
        return error_response('Unauthorized', 401)

    if user['role'] != 'customer':
        return error_response('Forbidden: customer access only', 403)

    body = request.get_json() or {}
    amount = body.get('amount')
    purpose = (body.get('purpose') or '').strip()
    monthly_income = body.get('monthly_income')

    if not validate_positive_number(amount):
        return error_response('Amount must be a positive number', 400)

    if not purpose:
        return error_response('Loan purpose is required', 400)

    if not validate_positive_number(monthly_income):
        return error_response('Monthly income must be a positive number', 400)

    credit_score = calculate_credit_score()
    insert_query = '''
        INSERT INTO loan_applications
        (user_id, amount, purpose, monthly_income, credit_score, status)
        VALUES (%s, %s, %s, %s, %s, 'pending')
    '''
    execute_query(
        insert_query,
        (user['id'], amount, purpose, monthly_income, credit_score),
        commit=True,
    )

    application = execute_query(
        'SELECT * FROM loan_applications WHERE user_id = %s ORDER BY id DESC LIMIT 1',
        (user['id'],),
        fetch_one=True,
    )

    created_at = application.get('created_at')
    try:
        if hasattr(created_at, 'isoformat'):
            created_at = created_at.isoformat()
        else:
            created_at = str(created_at)
    except Exception:
        created_at = str(created_at)

    return format_response(True, {
        'application_id': application['id'],
        'amount': float(application['amount']),
        'purpose': application['purpose'],
        'monthly_income': float(application['monthly_income']),
        'credit_score': application['credit_score'],
        'status': application['status'],
        'created_at': created_at,
    }, 'Loan application submitted successfully'), 200


@loans_bp.route('/my-applications', methods=['GET'])
def my_applications():
    user = get_authorized_user()
    if not user:
        return error_response('Unauthorized', 401)

    if user['role'] != 'customer':
        return error_response('Forbidden: customer access only', 403)

    applications = execute_query(
        'SELECT * FROM loan_applications WHERE user_id = %s ORDER BY created_at DESC',
        (user['id'],),
        fetch_all=True,
    )

    return format_response(True, {'applications': applications}, 'Applications loaded'), 200


@loans_bp.route('/pending', methods=['GET'])
def pending_loans():
    print(">>> PENDING LOANS CALLED <<<")
    user = get_authorized_user()
    if not user:
        return error_response('Unauthorized', 401)

    if user['role'] != 'credit_officer':
        return error_response('Forbidden: credit officer access only', 403)

    query = '''
        SELECT la.*, u.full_name AS applicant_name, u.email AS applicant_email
        FROM loan_applications la
        JOIN users u ON la.user_id = u.id
        WHERE la.status = 'pending'
        ORDER BY la.created_at DESC
    '''

    loans = execute_query(query, fetch_all=True)
    return format_response(True, {'pending_applications': loans}, 'Pending loans loaded'), 200


@loans_bp.route('/<int:application_id>/action', methods=['PUT'])
def action_loan(application_id):
    user = get_authorized_user()
    if not user:
        return error_response('Unauthorized', 401)

    if user['role'] != 'credit_officer':
        return error_response('Forbidden: credit officer access only', 403)

    body = request.get_json() or {}
    action = (body.get('action') or '').strip().lower()
    comments = (body.get('comments') or '').strip()

    if action not in ('approved', 'rejected'):
        return error_response("Action must be 'approved' or 'rejected'", 400)

    if len(comments) < 10:
        return error_response('Comments must be at least 10 characters', 400)

    application = execute_query(
        'SELECT * FROM loan_applications WHERE id = %s',
        (application_id,),
        fetch_one=True,
    )

    if not application:
        return error_response('Loan application not found', 404)

    if application['status'] != 'pending':
        return error_response('Loan application has already been decided', 400)

    update_query = 'UPDATE loan_applications SET status = %s WHERE id = %s'
    execute_query(update_query, (action, application_id), commit=True)

    insert_log = '''
        INSERT INTO audit_logs (application_id, officer_id, action, comments)
        VALUES (%s, %s, %s, %s)
    '''
    execute_query(insert_log, (application_id, user['id'], action, comments), commit=True)

    return format_response(True, {
        'application_id': application_id,
        'status': action,
        'action': action,
    }, 'Loan decision recorded successfully'), 200
