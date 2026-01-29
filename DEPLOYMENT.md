# Vercel Deployment Guide for Scrolla

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas database (your current one will work)

## Deployment Steps

### Step 1: Prepare Your Code

1. **Create a `.gitignore` in root** (if not exists):
```
node_modules/
.env
.DS_Store
dist/
build/
*.log
```

2. **Push to GitHub**:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy Backend (Server)

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select the **server** directory as the root directory
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: server
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   MONGODB_URI = mongodb+srv://pratyushpothal:Pratyush2004@cluster0.ivyxsby.mongodb.net/Scrolla=Cluster0
   JWT_SECRET = scrolla_super_secret_jwt_key_for_authentication_minimum_32_characters_long
   CLIENT_URL = (leave empty for now, will add after frontend deployment)
   ```

7. Click **"Deploy"**
8. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend (Client)

1. In Vercel, click **"Add New Project"** again
2. Import the same repository
3. Select the **client** directory as the root directory
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   ```
   VITE_API_URL = https://your-backend.vercel.app/api
   ```
   (Replace with your actual backend URL from Step 2)

6. Click **"Deploy"**
7. Copy your frontend URL (e.g., `https://your-frontend.vercel.app`)

### Step 4: Update Backend CORS

1. Go back to your backend project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Update `CLIENT_URL` with your frontend URL from Step 3
4. **Redeploy** the backend

### Step 5: Update MongoDB Network Access

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

## Environment Variables Summary

### Backend (.env):
```
MONGODB_URI=mongodb+srv://pratyushpothal:Pratyush2004@cluster0.ivyxsby.mongodb.net/Scrolla=Cluster0
JWT_SECRET=scrolla_super_secret_jwt_key_for_authentication_minimum_32_characters_long
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env):
```
VITE_API_URL=https://your-backend.vercel.app/api
```

## Testing Deployment

1. Visit your frontend URL
2. Try to register a new user
3. Create a post
4. Upload an image
5. Test all features

## Troubleshooting

### CORS Errors
- Make sure `CLIENT_URL` is set correctly in backend
- Redeploy backend after changing environment variables

### Database Connection Issues
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MONGODB_URI is correct

### API Not Working
- Check backend logs in Vercel dashboard
- Verify `VITE_API_URL` includes `/api` at the end
- Make sure both deployments are successful

## Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Automatic Deployments

- Every push to `main` branch will automatically redeploy
- You can disable this in Vercel settings if needed

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
