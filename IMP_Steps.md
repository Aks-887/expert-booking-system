✅ 1. Prerequisites

Make sure you have installed:

Node.js (v14 or higher)
npm (comes with Node.js)
MongoDB (Local installation OR MongoDB Atlas)

Check versions:

node -v
npm -v
✅ 2. Clone or Download the Project

If using Git:

git clone https://github.com/Aks-887/expert-booking-system.git
cd expert-booking-system

Or:

Download ZIP from GitHub
Extract it
Open the folder in VS Code
✅ 3. Install Dependencies

The project contains two folders:

backend/
frontend/
🔹 Install Backend Dependencies
cd backend
npm install
🔹 Install Frontend Dependencies

Open a new terminal:

cd frontend
npm install
✅ 4. Configure Environment Variables (Very Important)
🔹 Backend Setup

Inside backend/, create a file named:

.env

Add:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expert-booking
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here

If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string.

🔹 Frontend Setup

Inside frontend/, create a file named:

.env

Add:

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
✅ 5. Start the Backend Server

Inside the backend folder:

npm run dev

Expected output:

Server running on port 5000
MongoDB connected
✅ 6. Start the Frontend

Inside the frontend folder:

npm start

The application will open in your browser at:

http://localhost:3000
🎉 Application Running Successfully

You can now:

Browse experts
View available time slots
Book sessions
See real-time slot updates
⚠️ Common Issues & Fixes
MongoDB Not Connecting
Make sure MongoDB service is running
Verify the connection string in .env
Port Already in Use
Change PORT value in backend .env
Module Not Found Error

Run:

npm install

Inside the respective folder again.

🔥 Optional: Run Both Servers Together

If your root package.json supports it, install concurrently:

npm install -g concurrently

Then from root folder:

npm start
👨‍💻 Maintained By

Ayush Singh
GitHub: https://github.com/Aks-887