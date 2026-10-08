import os
import sqlite3
import decimal
import datetime
from config import Config
from werkzeug.security import generate_password_hash

try:
    import mysql.connector
    from mysql.connector import pooling
except ImportError:
    mysql = None

connection_pool = None
sqlite_db_path = None


def create_sqlite_schema(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON;')
    with conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('customer', 'credit_officer')),
                session_token TEXT DEFAULT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            '''
        )
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS loan_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                purpose TEXT NOT NULL,
                monthly_income REAL NOT NULL,
                credit_score INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            '''
        )
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                application_id INTEGER NOT NULL,
                officer_id INTEGER NOT NULL,
                action TEXT NOT NULL,
                comments TEXT DEFAULT NULL,
                timestamp TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY(application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
                FOREIGN KEY(officer_id) REFERENCES users(id) ON DELETE SET NULL
            )
            '''
        )
        # Ensure test users exist and use Werkzeug-compatible password hashes.
        # This updates existing records (in case an older DB used a different hash format).
        customer_hash = generate_password_hash("customer123")
        officer_hash = generate_password_hash("officer123")

        conn.execute(
            'INSERT OR IGNORE INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
            ('customer@test.com', customer_hash, 'Test Customer', 'customer'),
        )
        conn.execute(
            'INSERT OR IGNORE INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
            ('officer@test.com', officer_hash, 'Test Officer', 'credit_officer'),
        )

        # Overwrite password_hash for those test emails to ensure compatibility
        conn.execute(
            'UPDATE users SET password_hash = ? WHERE email = ?', (customer_hash, 'customer@test.com')
        )
        conn.execute(
            'UPDATE users SET password_hash = ? WHERE email = ?', (officer_hash, 'officer@test.com')
        )

        # Insert sample loan applications if none exist
        row = conn.execute('SELECT COUNT(*) AS count FROM loan_applications').fetchone()
        if row['count'] == 0:
            conn.execute(
                'INSERT INTO loan_applications (user_id, amount, purpose, monthly_income, credit_score, status) VALUES (?, ?, ?, ?, ?, ?)',
                (1, 25000.00, 'Home Renovation', 7000.00, 680, 'pending'),
            )
            conn.execute(
                'INSERT INTO loan_applications (user_id, amount, purpose, monthly_income, credit_score, status) VALUES (?, ?, ?, ?, ?, ?)',
                (1, 12000.00, 'Auto Purchase', 7000.00, 720, 'pending'),
            )
    conn.close()


def init_db_pool():
    global connection_pool, sqlite_db_path
    if connection_pool is None:
        if Config.USE_SQLITE:
            sqlite_db_path = os.path.join(os.path.dirname(__file__), Config.SQLITE_PATH)
            create_sqlite_schema(sqlite_db_path)
        else:
            if mysql is None:
                raise RuntimeError('MySQL connector is not installed.')
            
            # Ensure database and tables exist
            try:
                # First connect without database to ensure DB exists
                temp_conn = mysql.connector.connect(
                    host=Config.DB_HOST,
                    user=Config.DB_USER,
                    password=Config.DB_PASSWORD
                )
                temp_cursor = temp_conn.cursor()
                temp_cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                temp_cursor.close()
                temp_conn.close()
                
                # Now connect to create tables if they do not exist
                conn = mysql.connector.connect(
                    host=Config.DB_HOST,
                    user=Config.DB_USER,
                    password=Config.DB_PASSWORD,
                    database=Config.DB_NAME
                )
                cursor = conn.cursor()
                
                # Check if users table exists
                cursor.execute("SHOW TABLES LIKE 'users'")
                if not cursor.fetchone():
                    # Create users table
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS users (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            email VARCHAR(255) NOT NULL UNIQUE,
                            password_hash VARCHAR(255) NOT NULL,
                            full_name VARCHAR(255) NOT NULL,
                            role ENUM('customer', 'credit_officer') NOT NULL,
                            session_token VARCHAR(255) DEFAULT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            INDEX idx_users_email (email),
                            INDEX idx_users_created_at (created_at)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    ''')
                    
                    # Create loan_applications table
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS loan_applications (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id INT NOT NULL,
                            amount DECIMAL(15,2) NOT NULL,
                            purpose VARCHAR(255) NOT NULL,
                            monthly_income DECIMAL(15,2) NOT NULL,
                            credit_score INT NOT NULL,
                            status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            INDEX idx_loan_status (status),
                            INDEX idx_loan_created_at (created_at),
                            CONSTRAINT chk_loan_amount_positive CHECK (amount > 0),
                            CONSTRAINT chk_credit_score_range CHECK (credit_score BETWEEN 300 AND 850),
                            CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    ''')
                    
                    # Create audit_logs table
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS audit_logs (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            application_id INT NOT NULL,
                            officer_id INT NULL,
                            action VARCHAR(255) NOT NULL,
                            comments TEXT DEFAULT NULL,
                            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_audit_application FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
                            CONSTRAINT fk_audit_officer FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE SET NULL
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    ''')
                    
                    # Insert test users
                    customer_hash = generate_password_hash("customer123")
                    officer_hash = generate_password_hash("officer123")
                    
                    cursor.execute(
                        'INSERT INTO users (email, password_hash, full_name, role) VALUES (%s, %s, %s, %s)',
                        ('customer@test.com', customer_hash, 'Test Customer', 'customer'),
                    )
                    cursor.execute(
                        'INSERT INTO users (email, password_hash, full_name, role) VALUES (%s, %s, %s, %s)',
                        ('officer@test.com', officer_hash, 'Test Officer', 'credit_officer'),
                    )
                    
                    # Insert sample loan applications
                    cursor.execute(
                        'INSERT INTO loan_applications (user_id, amount, purpose, monthly_income, credit_score, status) VALUES (%s, %s, %s, %s, %s, %s)',
                        (1, 25000.00, 'Home Renovation', 7000.00, 680, 'pending'),
                    )
                    cursor.execute(
                        'INSERT INTO loan_applications (user_id, amount, purpose, monthly_income, credit_score, status) VALUES (%s, %s, %s, %s, %s, %s)',
                        (1, 12000.00, 'Auto Purchase', 7000.00, 720, 'pending'),
                    )
                    conn.commit()

                # Ensure audit_logs exists (it was missing from user's current schema!)
                cursor.execute("SHOW TABLES LIKE 'audit_logs'")
                if not cursor.fetchone():
                    cursor.execute('''
                        CREATE TABLE IF NOT EXISTS audit_logs (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            application_id INT NOT NULL,
                            officer_id INT NULL,
                            action VARCHAR(255) NOT NULL,
                            comments TEXT DEFAULT NULL,
                            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_audit_application FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
                            CONSTRAINT fk_audit_officer FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE SET NULL
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    ''')
                    conn.commit()
                
                # Overwrite/update password_hashes for test users to be Werkzeug-compatible
                customer_hash = generate_password_hash("customer123")
                officer_hash = generate_password_hash("officer123")
                cursor.execute(
                    'UPDATE users SET password_hash = %s WHERE email = %s',
                    (customer_hash, 'customer@test.com')
                )
                cursor.execute(
                    'UPDATE users SET password_hash = %s WHERE email = %s',
                    (officer_hash, 'officer@test.com')
                )
                conn.commit()
                
                cursor.close()
                conn.close()
            except Exception as e:
                print(f"Warning: Failed to auto-initialize MySQL database schema: {e}")
                # We won't block running because the user might have run schema.sql manually.

            connection_pool = pooling.MySQLConnectionPool(
                pool_name='banklite_pool',
                pool_size=5,
                pool_reset_session=True,
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
            )


def get_connection():
    if Config.USE_SQLITE:
        if sqlite_db_path is None:
            init_db_pool()
        conn = sqlite3.connect(sqlite_db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    if connection_pool is None:
        init_db_pool()
    return connection_pool.get_connection()


def serialize_db_val(val):
    if isinstance(val, decimal.Decimal):
        return float(val)
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.isoformat()
    return val


def clean_row(row):
    if row is None:
        return None
    return {k: serialize_db_val(v) for k, v in dict(row).items()}


def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=False):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        if Config.USE_SQLITE:
            cursor = conn.cursor()
            query = query.replace('%s', '?')
        else:
            cursor = conn.cursor(dictionary=True)
            
        cursor.execute(query, params or [])
        if commit:
            conn.commit()
        if fetch_one:
            row = cursor.fetchone()
            if row is None:
                return None
            return clean_row(row)
        if fetch_all:
            return [clean_row(r) for r in cursor.fetchall()]
        return None
    except Exception as exc:
        raise exc
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
