# Online Learning Platform

A full-featured online learning platform supporting note management, study progress tracking, and review plan management.

## Project Overview

This project is the final project for CS409 Web Programming course, aiming to create a database-driven web application with the following features:

- **Frontend**: React Single Page Application (SPA)
- **Backend**: Node.js + Express RESTful API
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Design Focus**: Responsive design with emphasis on UX/UI

## Core Features

1. **User Authentication**
   - User registration and login
   - JWT token authentication
   - Protected routes

2. **Note Management**
   - Create, edit, delete notes
   - Rich text editing
   - Tag categorization
   - Note search

3. **Review Plans**
   - Generate review schedules based on study plans
   - View upcoming reviews
   - Mark completed reviews
   - Review status tracking

4. **Study Progress Tracking**
   - Visualize study progress
   - Completed notes statistics
   - Pending review items statistics
   - Progress chart display

## Tech Stack

### Frontend
- React 18+
- React Router
- Axios
- CSS3 (Responsive Design)
- React Rich Text Editor

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt (Password encryption)
- CORS

## Project Structure

```
Projecting/
├── backend/           # Backend server
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── middleware/    # Middleware (authentication, etc.)
│   ├── config/        # Configuration files
│   └── server.js      # Server entry point
├── frontend/          # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main application component
│   └── public/
└── README.md
```

## Installation and Running

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
# Create .env file and configure the following environment variables:
# MONGODB_URI=mongodb://localhost:27017/learning-platform
# JWT_SECRET=your-secret-key
# PORT=5000
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will run at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Note Management
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Review Plans
- `POST /api/review-plan` - Create review plan
- `GET /api/review-plan` - Get all review plans
- `GET /api/review-plan/:id` - Get specific review plan
- `PUT /api/review-plan/:id` - Update review plan
- `DELETE /api/review-plan/:id` - Delete review plan

### Progress Tracking
- `GET /api/progress` - Get study progress statistics

## Team Roles

Recommended team role assignments:
- Frontend Developer
- Backend Developer
- UI/UX Designer
- Database Administrator
- Project Manager/Test Engineer

## Development Timeline

- **Proposal Submission**: October 16th
- **Prototypes and Heuristic Evaluation**: November 11th (in class)
- **Final Submission**: December 9th

## License

This project is for CS409 course.
