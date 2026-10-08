# BankLite - Fresh Start Commands

## STEP 1: Setup Database (Run Once)

```powershell
# Open MySQL
mysql -u root -p

# Inside MySQL CLI, paste this:
SOURCE C:\Users\prajw\Documents\E_BOX\236097-43891-663\schema.sql;

# Verify tables created
SHOW TABLES;
EXIT;
```

---

## STEP 2: Start Backend (Terminal 1 - New Terminal)

```powershell
cd "C:\Users\prajw\Documents\E_BOX\236097-43891-663\banklite-backend"

pip install -r requirements.txt

python app.py
```

**✅ You should see:**
```
Running on http://0.0.0.0:5000
```

---

## STEP 3: Start Frontend (Terminal 2 - New Terminal)

```powershell
cd "C:\Users\prajw\Documents\E_BOX\236097-43891-663\banklite-frontend"

python -m http.server 8000
```

**✅ You should see:**
```
Serving HTTP on 0.0.0.0 port 8000
```

---

## STEP 4: Open Browser

```
http://localhost:8000
```

**Login Credentials:**
- Email: `customer@test.com`
- Password: `customer123`

OR

- Email: `officer@test.com`
- Password: `officer123`

---

## Keep Both Terminals Running!

Terminal 1: Backend (port 5000) ← Keep Running
Terminal 2: Frontend (port 8000) ← Keep Running
Browser: http://localhost:8000 ← Open in browser
