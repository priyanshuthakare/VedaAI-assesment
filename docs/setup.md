# Local Setup Guide

Follow these steps to run the complete VedaAI stack on your local machine.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Redis (Local instance or Upstash Redis URL)
- Google Gemini API Key

## 1. Backend Setup
Navigate to the `backend` directory and install the dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` folder:
```env
# Server
NODE_ENV=development
PORT=4000
ALLOWED_ORIGINS=http://localhost:3000

# Database & Caching
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379

# AI Integration
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the development server:
```bash
npm run dev
```
*The backend API and WebSocket server will now be running on `http://localhost:4000`.*

## 2. Frontend Setup
Navigate to the `frontend` directory and install the dependencies:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the root of the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

Start the frontend development server:
```bash
npm run dev
```
*The web application will now be accessible at `http://localhost:3000`.*
