# Project Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas cloud service)
- npm or yarn

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment Variables

Create `backend/.env` file (you can refer to `backend/.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**If using MongoDB Atlas:**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get the connection string
4. Set `MONGODB_URI` to your connection string

### 3. Start Backend Server

```bash
cd backend
npm start
```

The backend server will run at http://localhost:5000

### 4. Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### 5. Configure Frontend Environment Variables (Optional)

If you need to connect to a different backend API, create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will run at http://localhost:3000 and the browser will open automatically.

## Feature Testing

### 1. Register New User
- Visit http://localhost:3000/register
- Enter email and password (at least 6 characters)
- After registration, you will be automatically logged in

### 2. Create Note
- After logging in, click "Notes" in the navigation bar
- Click "+ New Note"
- Enter title and content
- You can add tags (separated by commas)
- Save the note

### 3. Create Review Plan
- Click "Review Plans" in the navigation bar
- Click "+ New Review Plan"
- Select one or more notes
- Choose review date
- Create the plan

### 4. View Study Progress
- Click "Progress" in the navigation bar
- View note statistics, review statistics, and completion rate

## API Endpoint Testing

Use Postman or similar tools to test the API:

### Register
```
POST http://localhost:5000/api/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
```
POST http://localhost:5000/api/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Get Notes (Requires Authentication)
```
GET http://localhost:5000/api/notes
Authorization: Bearer <your-token>
```

## Production Deployment

### Backend Deployment

1. Set production environment variables:
   - `NODE_ENV=production`
   - Use a strong password as `JWT_SECRET`
   - Configure production database URI

2. You can deploy to the following platforms:
   - Heroku
   - DigitalOcean
   - Render
   - Railway

### Frontend Deployment

1. Build production version:
```bash
cd frontend
npm run build
```

2. Deploy to the following platforms:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

3. Make sure `REACT_APP_API_URL` environment variable points to production backend URL

## Common Issues

### MongoDB Connection Failed
- Make sure MongoDB service is running (if installed locally)
- Check if `MONGODB_URI` is correct
- If using Atlas, make sure IP address is whitelisted

### CORS Errors
- Backend has CORS configured to allow all origins
- Production environment should restrict allowed domains

### Port Already in Use
- Backend default port: 5000
- Frontend default port: 3000
- You can modify ports in `.env` file

## Technical Support

If you encounter issues, please check:
1. Node.js version meets requirements
2. All dependencies are correctly installed
3. Environment variables are correctly configured
4. MongoDB is running properly
