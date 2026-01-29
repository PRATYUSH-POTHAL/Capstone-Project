# 🎨 Scrolla - Interactive Social Media Feed Platform

## 📋 Project Overview

**Scrolla** is an innovative social media platform that solves the critical problems of modern social media:
- ✅ Restores user intent through mood + purpose selection
- ✅ Provides emotional alignment with adaptive feeds
- ✅ Eliminates endless scrolling with journey-based feeds
- ✅ Encourages meaningful engagement through micro-interactions
- ✅ Ensures age-appropriate content with robust filtering

---

## 🚀 Key Features

### 1. **Intent-Based Feed System**
- Users select their **mood** (calm, focused, motivated, low, happy, stressed)
- Users select their **purpose** (learn, relax, discuss, inspire, entertain)
- Users select **time constraint** (5, 10, 20, 30 minutes)
- Feed is dynamically generated based on these selections

### 2. **Age Restrictions**
- **Kids (<13)**: Access to Kids Zone with only cartoon and educational content
- **Teens (13-17)**: Age-appropriate content filtering
- **Adults (18+)**: Full access to all content

### 3. **Kids Zone** 🧒
- Dedicated safe space for children
- Only cartoon and educational content
- Parent-friendly interface
- No inappropriate content

### 4. **Mood Mosaic** 🎭
- Emotional state-based content curation
- Mood-adaptive UI themes
- Content that matches emotional readiness

### 5. **Journey-Based Feed** 🗺️
- **No infinite scrolling**
- Clear start and end points
- Progress tracking with visual indicators
- Journey completion summaries

### 6. **Interactive Micro-Engagement** 💬
- Reflection prompts after each post
- Emotional response collection
- Choice-based interactions
- Meaningful engagement beyond likes

### 7. **Hashtag Filtering** #️⃣
- Filter posts by hashtags (e.g., `#food`, `#tech`, `#art`)
- Only relevant content appears
- Age-appropriate filtering applied

### 8. **Video Upload & Sharing** 📹
- Upload videos and images
- Share to WhatsApp, Facebook, Twitter, etc.
- Copy link functionality

### 9. **Social Features** 👥
- Follow/Unfollow users
- Like and comment on posts
- User profiles
- Follower/following counts

---

## 💻 Technology Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for icons
- **React Share** for social sharing

### Backend
- **Node.js** with **Express.js**
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** ODM
- **JWT** for authentication
- **Bcrypt** for password hashing

---

## 📂 Project Structure

```
scrolla/
├── PROJECT_DOCUMENTATION.md    # Complete project documentation
├── IMPLEMENTATION_GUIDE.md     # Step-by-step implementation guide
├── README.md                   # This file
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MoodSelector.jsx          # Mood/purpose/time selection
│   │   │   ├── JourneyFeed.jsx           # Journey-based feed
│   │   │   ├── InteractionPrompt.jsx     # Micro-engagement prompts
│   │   │   ├── KidsZone.jsx              # Kids-safe content area
│   │   │   ├── PostCard.jsx              # Individual post display
│   │   │   ├── CreatePost.jsx            # Create new posts
│   │   │   ├── ShareButton.jsx           # Social media sharing
│   │   │   ├── VideoUpload.jsx           # Video upload component
│   │   │   ├── Dashboard.jsx             # User dashboard
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx                  # Main feed page
│   │   │   ├── Login.jsx                 # Login page
│   │   │   ├── Register.jsx              # Registration with age
│   │   │   ├── Profile.jsx               # User profile
│   │   │   ├── JourneyComplete.jsx       # Journey summary
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Authentication context
│   │   └── services/
│   │       └── api.js                    # API service layer
│   └── ...
├── server/                     # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js             # User model with age, mood, preferences
│   │   └── Post.js             # Post model with age restrictions, hashtags
│   ├── controllers/
│   │   ├── authController.js   # Auth logic + mood/intent updates
│   │   └── postController.js   # Post logic + personalized feed
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── posts.js            # Post routes (feed, kids-zone, hashtags)
│   │   └── users.js            # User routes
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── ...
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   └── server.js               # Main server file
└── ...
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** 18+ 
- **MongoDB Atlas** account
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/PRATYUSH-POTHAL/Capstone-Project.git
cd scrolla
```

### 2. Backend Setup

#### Navigate to server folder
```bash
cd server
```

#### Install dependencies
```bash
npm install
```

#### Create `.env` file
Create a file named `.env` in the `server/` folder with:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
PORT=5000
NODE_ENV=development
```

**Important**: Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string.

#### Start the backend server
```bash
npm start
```

Server will run on **http://localhost:5000**

### 3. Frontend Setup

#### Open new terminal and navigate to client folder
```bash
cd client
```

#### Install dependencies
```bash
npm install
```

#### Create `.env` file (optional)
Create a file named `.env` in the `client/` folder with:

```env
VITE_API_URL=http://localhost:5000
```

#### Start the frontend development server
```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

### 4. Access the Application
Open your browser and go to: **http://localhost:5173**

---

## 🗄️ MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free account

### 2. Create a Cluster
- Click "Build a Cluster"
- Choose FREE tier (M0)
- Select cloud provider and region

### 3. Create Database User
- Database Access → Add New Database User
- Choose password authentication
- Save username and password

### 4. Whitelist IP Address
- Network Access → Add IP Address
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- (For production, use specific IP)

### 5. Get Connection String
- Clusters → Connect
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with `scrolla` or your preferred name

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/scrolla?retryWrites=true&w=majority
```

---

## 🧪 Testing the Features

### 1. **Register a User**
- Go to http://localhost:5173/register
- Enter name, email, password, username, and **age**
- **Age determines user type**:
  - Age < 13 → Kid (access to Kids Zone only)
  - Age 13-17 → Teen (filtered content)
  - Age 18+ → Adult (full access)

### 2. **Select Mood & Intent**
- After login, select your mood (e.g., "Happy")
- Select your purpose (e.g., "Entertain")
- Select time constraint (e.g., "10 minutes")

### 3. **Experience Journey-Based Feed**
- View curated posts based on your selections
- Progress bar shows journey completion
- Interactive prompts after each post

### 4. **Test Kids Zone** (if age < 13)
- Kids users automatically see only cartoon/educational content
- Adults cannot access Kids Zone

### 5. **Test Hashtag Filtering**
- Create a post with hashtag (e.g., "This is amazing #food")
- Search or filter by `#food`
- Only food-related posts appear

### 6. **Test Video Upload**
- Click "Create Post"
- Upload video file
- Add hashtags and mood tags
- Post is visible to appropriate age groups

### 7. **Test Sharing**
- Click share button on any post
- Share to WhatsApp, Facebook, Twitter
- Copy link functionality

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register         - Register new user (requires age)
POST   /api/auth/login            - Login user
GET    /api/auth/me               - Get current user
PUT    /api/auth/mood-intent      - Update mood, purpose, time constraint
```

### Posts
```
GET    /api/posts                 - Get all posts (age-filtered)
GET    /api/posts/feed            - Get personalized feed (mood/purpose/time)
GET    /api/posts/kids-zone       - Get kids-safe content (kids only)
GET    /api/posts/hashtag/:tag    - Get posts by hashtag
GET    /api/posts/user/:username  - Get user's posts
POST   /api/posts                 - Create new post
PUT    /api/posts/:id/like        - Like/unlike post
POST   /api/posts/:id/comment     - Add comment
POST   /api/posts/:id/share       - Increment share count
POST   /api/posts/:id/interact    - Add interaction (reflection/emotion)
DELETE /api/posts/:id             - Delete post
```

---

## 🎯 Key Implementations

### 1. Age-Based Content Filtering (Post Controller)
```javascript
// Kids see only cartoon/educational content
if (user.userType === 'kid') {
  query.ageRestriction = 'kids'
  query.contentType = { $in: ['cartoon', 'educational'] }
}

// Teens see kids + teen content
else if (user.userType === 'teen') {
  query.ageRestriction = { $in: ['kids', 'teen'] }
}

// Adults see all content
else {
  query.ageRestriction = { $in: ['kids', 'teen', 'adult'] }
}
```

### 2. Mood-Based Content Mapping
```javascript
const moodMap = {
  'calm': ['calm', 'relaxing'],
  'focused': ['focused', 'educational'],
  'motivated': ['motivational', 'uplifting', 'energetic'],
  'low': ['uplifting', 'fun', 'motivational'],
  'happy': ['fun', 'energetic'],
  'stressed': ['calm', 'relaxing'],
}
```

### 3. Journey Time Calculation
```javascript
// Approx 2 minutes per post
const postsLimit = Math.ceil(timeConstraint / 2)
```

---

## 📸 Screenshots

*(Add screenshots after implementation)*

1. **Mood Selection Screen**
2. **Purpose Selection Screen**
3. **Journey-Based Feed**
4. **Interactive Micro-Engagement**
5. **Kids Zone**
6. **Hashtag Filtering**
7. **Journey Completion Summary**

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Render/Railway)
- Push code to GitHub
- Connect repository to Render
- Add environment variables
- Deploy

### Environment Variables (Production)
```env
# Backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-backend-api.onrender.com
```

---

## 📝 Documentation Files

1. **PROJECT_DOCUMENTATION.md** - Complete project documentation including:
   - Problem statement & industry relevance
   - Requirement analysis (functional & non-functional)
   - System architecture & data flow
   - Technology stack
   - Module-wise implementation
   - Testing & evaluation
   - Deployment guide
   - Outcomes & learnings

2. **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide with all code files

---

## 👥 Team

- **Project Name**: Scrolla
- **Course**: Capstone Project
- **Submission Date**: January 2026

---

## 📄 License

This project is created for educational purposes as part of a capstone project.

---

## 🤝 Contributing

This is a capstone project. For any questions or suggestions, please contact the team members.

---

## 📞 Support

For issues or questions:
1. Check the PROJECT_DOCUMENTATION.md
2. Check the IMPLEMENTATION_GUIDE.md
3. Review API endpoints in this README
4. Contact team members

---

## 🎉 Features Checklist

- ✅ User registration with age verification
- ✅ Age-based content filtering (Kids/Teen/Adult)
- ✅ Mood selection (6 moods)
- ✅ Purpose selection (5 purposes)
- ✅ Time constraint selection
- ✅ Personalized feed generation
- ✅ Journey-based feed (no infinite scroll)
- ✅ Progress tracking
- ✅ Interactive micro-engagement (reflection/emotion)
- ✅ Kids Zone (cartoon & educational only)
- ✅ Hashtag filtering
- ✅ Video upload support
- ✅ Social sharing (WhatsApp, Facebook, Twitter)
- ✅ Follow/Unfollow users
- ✅ Like/Comment on posts
- ✅ User dashboard with logout
- ✅ JWT authentication
- ✅ MongoDB Atlas integration
- ✅ Responsive design (Tailwind CSS)

---

**🎨 Welcome to Scrolla - Where Social Media Serves You, Not The Other Way Around!**
