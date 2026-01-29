# 🔧 MongoDB Connection Fix Guide

## Current Issue
**Error**: `bad auth : authentication failed`

This means your MongoDB credentials are incorrect or the user doesn't exist.

---

## ✅ Solution Steps

### Option 1: Fix MongoDB Atlas Credentials (Recommended)

#### Step 1: Go to MongoDB Atlas
1. Visit: https://cloud.mongodb.com/
2. Login with your account

#### Step 2: Check/Create Database User
1. Click on **"Database Access"** in the left sidebar
2. Check if user **"pratyushpothal"** exists
3. If it doesn't exist, click **"Add New Database User"**
   - **Username**: `pratyushpothal` (or any name you want)
   - **Password**: Click "Autogenerate Secure Password" OR set your own
   - **Database User Privileges**: Select "Read and write to any database"
   - Click **"Add User"**

#### Step 3: Whitelist Your IP Address
1. Click on **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0`
4. Click **"Confirm"**

#### Step 4: Get Correct Connection String
1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. **IMPORTANT**: Replace `<password>` with your actual password

#### Step 5: Update Your .env File

Replace the content in `server/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.ggdjic9.mongodb.net/scrolla?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=scrolla_super_secret_jwt_key_for_authentication_minimum_32_characters_long
```

**IMPORTANT**: 
- Replace `YOUR_USERNAME` with your MongoDB username
- Replace `YOUR_PASSWORD` with your MongoDB password
- If your password has special characters like `@`, `#`, `$`, etc., you must URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `!` → `%21`

**Example:**
If your password is `MyPass@2024`, use `MyPass%402024` in the connection string.

---

### Option 2: Use a New MongoDB Cluster

If you can't access the existing cluster, create a new one:

1. Go to https://cloud.mongodb.com/
2. Create a new FREE cluster (M0)
3. Create a new database user
4. Whitelist IP (0.0.0.0/0)
5. Get the new connection string
6. Update `server/.env`

---

### Option 3: Use Local MongoDB (Temporary)

If you want to test quickly without Atlas:

1. Install MongoDB locally: https://www.mongodb.com/try/download/community

2. Update `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scrolla
JWT_SECRET=scrolla_super_secret_jwt_key_for_authentication_minimum_32_characters_long
```

3. Start MongoDB service:
```powershell
# Windows
net start MongoDB
```

---

## 🔍 Common Password Issues

### Your current password appears to be: `PPothal@2004`

**URL Encoded version**: `PPothal%402004`

Try this in your .env:
```env
MONGODB_URI=mongodb+srv://pratyushpothal:PPothal%402004@cluster0.ggdjic9.mongodb.net/scrolla?retryWrites=true&w=majority&appName=Cluster0
```

---

## ✅ After Fixing .env

1. Save the file
2. Restart the server:
```powershell
cd server
npm start
```

3. You should see:
```
MongoDB connected: cluster0-shard-00-00.ggdjic9.mongodb.net
Server running on port 5000
```

---

## 🆘 Still Having Issues?

### Check Password Encoding
If your password has special characters, use this tool to encode it:
https://www.urlencoder.org/

### Test Connection String
You can test your MongoDB connection using MongoDB Compass:
1. Download: https://www.mongodb.com/try/download/compass
2. Paste your connection string
3. If it connects, your credentials are correct

### Create New User
The easiest solution: Create a NEW database user in MongoDB Atlas with a simple password (only letters and numbers, no special characters).

---

## 📞 Next Steps

1. Follow **Option 1** steps above
2. Update your .env file with correct credentials
3. Restart the server
4. Come back if you still have issues!

---

**Pro Tip**: Keep your MongoDB Atlas dashboard open while developing. It shows real-time connection status and logs.
