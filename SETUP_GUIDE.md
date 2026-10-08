# BankLite - Complete Setup Guide

## 📁 Project Structure Created

```
236097-43891-663/
├── schema.sql                          # Database schema
├── banklite-backend/                   # Python Flask Backend
│   ├── app.py                          # Main Flask app
│   ├── config.py                       # Configuration
│   ├── database.py                     # DB connection
│   ├── auth.py                         # Login endpoint
│   ├── loans.py                        # Loan endpoints (4 routes)
│   ├── utils.py                        # Helper functions
│   ├── requirements.txt                # Python dependencies
│   └── .env                            # Environment variables
└── banklite-frontend/                  # Vanilla HTML/CSS/JS Frontend
    ├── index.html                      # SPA entry point
    ├── css/
    │   └── style.css                   # All styling
    └── js/
        ├── app.js                      # Router & page rendering
        ├── api.js                      # API calls
        ├── auth.js                     # Auth management
        └── utils.js                    # Helpers
```

## ⚡ Quick Start (3 Steps)

### Step 1: Database Setup (2 minutes)

```bash
# Open MySQL CLI
mysql -u root -p

# Create database
SOURCE C:\Users\prajw\Documents\E_BOX\236097-43891-663\schema.sql;

# Verify
SHOW TABLES;
SELECT * FROM users;
```

**Test Users Created:**
- Email: `customer@test.com` | Password: `customer123`
- Email: `officer@test.com` | Password: `officer123`

---

### Step 2: Backend Setup (3 minutes)

```bash
# Terminal 1: Backend
cd C:\Users\prajw\Documents\E_BOX\236097-43891-663\banklite-backend

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py
```

**Server runs on:** `http://localhost:5000`

---

### Step 3: Frontend Setup (2 minutes)

```bash
# Terminal 2: Frontend
cd C:\Users\prajw\Documents\E_BOX\236097-43891-663\banklite-frontend

# Start local server (Windows)
python -m http.server 8000
```

**Frontend runs on:** `http://localhost:8000`

---

## 🧪 Test the Application

1. **Open Browser:** `http://localhost:8000`
2. **Login as Customer:**
   - Email: `customer@test.com`
   - Password: `customer123`
   - View dashboard → Apply for new loan
3. **Login as Officer:**
   - Email: `officer@test.com`
   - Password: `officer123`
   - View pending loans → Review & approve/reject

---

## 📝 Backend API Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| `POST` | `/api/v1/auth/login` | Public | Login |
| `POST` | `/api/v1/loans/apply` | Customer | Submit application |
| `GET` | `/api/v1/loans/my-applications` | Customer | View applications |
| `GET` | `/api/v1/loans/pending` | Officer | View pending loans |
| `PUT` | `/api/v1/loans/<id>/action` | Officer | Approve/reject loan |

---

## ⚙️ Configuration

### Backend `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=banklite
JWT_SECRET=your-secret-key-min-32-chars
PORT=5000
```

### Frontend API URL

**Default:** `http://localhost:5000/api/v1` (hardcoded in `js/api.js`)

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Port 8000 (frontend) - just change port
python -m http.server 9000
```

### Database Connection Error

- Verify MySQL is running
- Check `.env` has correct DB credentials
- Verify `schema.sql` was executed

### CORS Error

- Ensure backend is running before frontend
- Backend CORS configured for `localhost:3000` and `localhost:8000`

### Login Failed

- Verify test users exist: `SELECT * FROM users;`
- Check password: test password is `customer123`

---

## 📦 What's Included

✅ Complete React Frontend (src/ folder)  
✅ Complete Vanilla Frontend (banklite-frontend/)  
✅ Complete Python Backend (banklite-backend/)  
✅ MySQL Database Schema (schema.sql)  
✅ Authentication System  
✅ Loan Application Workflow  
✅ Officer Underwriting Console  
✅ Risk Scoring Algorithm  

---

## 🚀 Next Steps After Setup

1. ✅ Database running
2. ✅ Backend API running on port 5000
3. ✅ Frontend server running on port 8000
4. ✅ Login with test credentials
5. ✅ Test all workflows

---

## 📞 File Locations

| Component | Location |
|-----------|----------|
| Schema SQL | `236097-43891-663/schema.sql` |
| Backend | `236097-43891-663/banklite-backend/` |
| Frontend (Vanilla) | `236097-43891-663/banklite-frontend/` |
| Frontend (React) | `236097-43891-663/Frontend/` |

---

**Ready to launch?** Open 2 terminals and follow Step 2 & 3 above! 🎉
