import os
from dotenv import load_dotenv

load_dotenv()


def str_to_bool(value):
    return str(value).strip().lower() in ('1', 'true', 'yes', 'on')


class Config:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'banklite')
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-min-32-chars')
    PORT = int(os.getenv('PORT', 5000))
    USE_SQLITE = str_to_bool(os.getenv('USE_SQLITE', '0'))
    SQLITE_PATH = os.getenv('SQLITE_PATH', 'banklite.db')
    CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:8000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:3007', 'http://localhost:3008', 'http://localhost:3009', 'http://localhost:3010', 'http://localhost:3011', 'http://localhost:3012', 'http://localhost:3013', 'http://localhost:3014', 'http://localhost:3015', 'http://localhost:3016', 'http://localhost:3017', 'http://localhost:3018', 'http://localhost:3019']


def error_response(message, code=400):
    return {
        'success': False,
        'error': message,
        'code': code,
    }, code
