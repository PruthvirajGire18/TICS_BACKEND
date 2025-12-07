# MongoDB Setup Guide

## Option 1: Local MongoDB (Recommended for Development)

### Windows:
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. MongoDB service should start automatically
4. In `server/.env`, use:
   ```
   MONGODB_URI=mongodb://localhost:27017/tics
   ```

### Verify MongoDB is Running:
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Or check if port 27017 is listening
netstat -ano | findstr ":27017"
```

### Start MongoDB Manually (if needed):
```powershell
# Start MongoDB service
net start MongoDB

# Or if installed as a service:
sc start MongoDB
```

---

## Option 2: MongoDB Atlas (Cloud - Free Tier)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select cloud provider and region
4. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set privileges to "Atlas admin"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `tics` (or your preferred database name)

### Step 6: Update .env File
In `server/.env`, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tics?retryWrites=true&w=majority
```

**Example:**
```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/tics?retryWrites=true&w=majority
```

---

## Troubleshooting

### Error: "buffering timed out"
- **Cause**: MongoDB is not running or connection string is wrong
- **Solution**: 
  - Check if MongoDB service is running (local)
  - Verify connection string in `.env` file
  - Check network/firewall settings

### Error: "SSL/TLS error"
- **Cause**: Wrong connection string format for MongoDB Atlas
- **Solution**: 
  - Make sure you're using `mongodb+srv://` for Atlas
  - Verify password doesn't have special characters (URL encode if needed)
  - Check if IP is whitelisted in Atlas Network Access

### Error: "Authentication failed"
- **Cause**: Wrong username/password
- **Solution**: 
  - Verify database user credentials
  - Make sure password is URL-encoded if it has special characters

### MongoDB Not Starting (Local)
```powershell
# Check MongoDB logs
# Usually located at: C:\Program Files\MongoDB\Server\<version>\log\mongod.log

# Try reinstalling MongoDB service
mongod --install

# Or start manually
mongod --dbpath "C:\data\db"
```

---

## Quick Test

After setting up, test the connection:

```powershell
# In server directory
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

---

## Default Configuration

If you don't set `MONGODB_URI`, the app will try to connect to:
```
mongodb://localhost:27017/tics
```

Make sure MongoDB is running locally if using this default.

