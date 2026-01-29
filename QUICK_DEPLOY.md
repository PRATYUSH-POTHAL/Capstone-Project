# Quick Deployment Commands

## 1. Install Vercel CLI (Optional but recommended)
```bash
npm install -g vercel
```

## 2. Deploy Backend First
```bash
cd server
vercel
```
Follow prompts and copy the production URL

## 3. Deploy Frontend
```bash
cd ../client
vercel
```
Add environment variable when prompted:
- VITE_API_URL = <your-backend-url>/api

## 4. Link and Configure
After both are deployed:
1. Update backend CLIENT_URL with frontend URL
2. Update MongoDB to allow all IPs (0.0.0.0/0)
3. Redeploy backend: `vercel --prod`

Done! 🎉
