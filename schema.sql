-- BankLite Loan Origination System Database Schema
-- Create the banklite database
CREATE DATABASE IF NOT EXISTS banklite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE banklite;

-- Users table stores customer and officer records
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

-- Loan applications table stores customer loan requests
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

-- Audit log table tracks officer decisions
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

-- Test users and sample loan applications
INSERT INTO users (email, password_hash, full_name, role)
VALUES
('customer@test.com', '$2b$12$0s4D/NRD5k0ZgJx1Dg7Riu0vmXyFrhl2pLr3pDYbpONgHeuomgT4S', 'Test Customer', 'customer'),
('officer@test.com', '$2b$12$0s4D/NRD5k0ZgJx1Dg7Riu0vmXyFrhl2pLr3pDYbpONgHeuomgT4S', 'Test Officer', 'credit_officer');

INSERT INTO loan_applications (user_id, amount, purpose, monthly_income, credit_score, status)
VALUES
(1, 25000.00, 'Home Renovation', 7000.00, 680, 'pending'),
(1, 12000.00, 'Auto Purchase', 7000.00, 720, 'pending');

-- How to run this file:
-- 1. Save this SQL to schema.sql
-- 2. Run: mysql -u root -p < schema.sql
-- 3. Verify using: SHOW TABLES; SELECT * FROM users; SELECT * FROM loan_applications;
