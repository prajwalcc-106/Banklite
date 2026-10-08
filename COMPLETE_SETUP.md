# 🚀 BankLite - COMPLETE STEP-BY-STEP SETUP GUIDE

## ⚠️ IMPORTANT: MySQL Must Run First!

---

## STEP 1: Start MySQL Service

**Open Command Prompt (NOT PowerShell) as Administrator:**

```cmd
net start MySQL80
```

**Expected Output:**
```
The MySQL80 service has been started successfully.
```

If you get `The service is already started`, that's OK - MySQL is running.

If you get an error like "service not found", try:
```cmd
net start MySQL
```

---

## STEP 2: Create Database

**In the same Command Prompt:**

```cmd
mysql -u root -p
```

*When prompted for password, type it (or just press Enter if no password)*

**Then inside MySQL CLI, paste this:**

```sql
SOURCE C:\Users\prajw\Documents\E_BOX\236097-43891-663\schema.sql;
```

**Verify it worked:**
```sql
SHOW TABLES;
SELECT * FROM users;
```

**Exit MySQL:**
```sql
EXIT;
```

✅ Database is now ready!

---

## STEP 3: Start Backend Server (Terminal 1)

**Open NEW PowerShell terminal:**

Copy & paste this entire command:

```powershell
cd "C:\Users\prajw\Documents\E_BOX\236097-43891-663\banklite-backend"; python app.py
```

**Expected Output:**
```
WARNING: This is a development server. Do not use it in production deployments.
Use a production WSGI server instead.
Running on http://0.0.0.0:5000
Press CTRL+C to quit
```

✅ **KEEP THIS TERMINAL OPEN!**

---

## STEP 4: Start Frontend Server (Terminal 2)

**Open ANOTHER NEW PowerShell terminal:**

Copy & paste this entire command:

```powershell
cd "C:\Users\prajw\Documents\E_BOX\236097-43891-663\banklite-frontend"; python -m http.server 8000
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

✅ **KEEP THIS TERMINAL OPEN!**

---

## STEP 5: Open in Browser

Open your web browser and go to:

```
http://localhost:8000
```

You should see the **BankLite Login Page**

---

## STEP 6: Login

Use these test credentials:

### Option 1: Customer Account
- **Email:** `customer@test.com`
- **Password:** `customer123`

Click **Login** → See your loan applications dashboard

### Option 2: Credit Officer Account
- **Email:** `officer@test.com`
- **Password:** `officer123`

Click **Login** → See pending loan applications to review

---

## ✅ You Now Have 3 Things Running:

1. **MySQL Database** (Command Prompt)
2. **Backend API** (Terminal 1) - Port 5000
3. **Frontend Server** (Terminal 2) - Port 8000

---

## 🧪 Test Features

### Customer:
- ✅ View my loan applications
- ✅ Apply for new loan
- ✅ See credit score

### Credit Officer:
- ✅ View all pending applications
- ✅ See applicant details
- ✅ Approve or Reject loans
- ✅ Add comments

---

## ❌ Troubleshooting

### Error: "Can't connect to MySQL"
- Make sure you ran `net start MySQL80` first
- Check if MySQL is actually running

### Error: "Port 5000 already in use"
- Kill the process: `netstat -ano | findstr :5000`
- Then: `taskkill /PID <number> /F`

### Error: "Port 8000 already in use"
- Try different port: `python -m http.server 9000`
- Then visit `http://localhost:9000`

### Frontend shows blank/error
- Make sure backend is running on port 5000
- Check browser console (F12) for errors
- Refresh the page

---

## 📊 File Locations

```
C:\Users\prajw\Documents\E_BOX\236097-43891-663\
├── schema.sql                    ← Database
├── banklite-backend\
│   ├── app.py                    ← Start here for backend
│   └── requirements.txt           ← Already installed
└── banklite-frontend\
    ├── index.html                ← Frontend main file
    ├── css\style.css
    └── js\
        ├── app.js
        ├── api.js
        ├── auth.js
        └── utils.js
```

---

## 🎯 Quick Reference

| Component | Command | Port | Status |
|-----------|---------|------|--------|
| MySQL | `net start MySQL80` | 3306 | ✅ Check first |
| Backend | `cd banklite-backend; python app.py` | 5000 | Running |
| Frontend | `cd banklite-frontend; python -m http.server 8000` | 8000 | Running |
| Browser | http://localhost:8000 | - | Login here |

---

**Follow these steps in order and everything will work!** ✨
