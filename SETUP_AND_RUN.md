# Expert Booking System - Setup & Run Guide

## ✅ Prerequisites
- Node.js v14+ and npm
- MongoDB (local or cloud)
- Git

## 🚀 Quick Start

### 1. Install Dependencies
Run from the root directory (`g:\Vedaz`):
```bash
npm run install-all
```

### 2. Configure Environment Variables

**Backend** (already configured in `backend/.env`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expert-booking
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

**Frontend** (already configured in `frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Start MongoDB
```bash
# Windows with MongoDB installed
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

### 4. Run the Application

**Option A: Run Both Servers Together (Recommended)**
```bash
npm start
```
This runs both backend and frontend servers concurrently.

**Option B: Run Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📋 Features Implemented

### ✨ UI Enhancements (Tailwind CSS)
- Modern dark theme with gradient buttons
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional card-based layouts
- Real-time loading spinners
- Color-coded status badges

### 🔧 Backend Features
- Expert management with search and filtering
- Time slot management
- Booking system with validation
- Database transactions for race condition prevention
- Socket.io for real-time updates
- CORS configuration
- Error handling middleware

### 🎨 Frontend Features
- Expert listing with pagination
- Search and category filtering
- Expert detail view with available time slots
- Booking form with validation
- My Bookings page with booking management
- Real-time slot updates via Socket.io
- Responsive navigation

## 🧪 Testing the Application

### Test Expert Search
1. Go to http://localhost:3000
2. Use the search bar to find experts
3. Filter by category
4. Test pagination

### Test Expert Details
1. Click "View Details" on any expert card
2. See available time slots
3. Open in multiple tabs to test real-time updates

### Test Booking System
1. Click a time slot
2. Fill in your details (name, email, phone)
3. Verify form validation
4. Complete the booking

### Test Double Booking Prevention
1. Open an expert detail in two windows
2. Try booking the same slot
3. Verify only one booking succeeds
4. Watch slot disappear in the other window

## 📁 Project Structure

```
g:\Vedaz\
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── expertController.js
│   │   ├── bookingController.js
│   │   └── timeSlotController.js
│   ├── models/
│   │   ├── Expert.js
│   │   ├── Booking.js
│   │   └── TimeSlot.js
│   ├── routes/
│   │   ├── expertRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── timeSlotRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server with Socket.io
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── ExpertList.js      # Main listing page
│   │   │   ├── ExpertDetail.js    # Expert details + slots
│   │   │   ├── Booking.js         # Booking form
│   │   │   └── MyBookings.js      # User bookings
│   │   ├── services/
│   │   │   ├── api.js             # Axios API calls
│   │   │   └── socketService.js   # Socket.io client
│   │   ├── context/
│   │   │   └── SocketContext.js   # Global socket state
│   │   ├── App.js                 # Main app with routing
│   │   ├── App.css                # Global styles
│   │   ├── index.css              # Tailwind directives
│   │   └── index.js               # Entry point
│   ├── .env                       # Environment variables
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── postcss.config.js          # PostCSS configuration
│   └── package.json
│
├── package.json                   # Root scripts
└── README.md                      # Project documentation
```

## 🎨 Tailwind CSS Features Used

- **Colors**: Slate, Blue, Purple, Green, Red, Yellow themes
- **Layouts**: Flexbox, Grid (responsive)
- **Components**: Cards, Buttons, Forms, Badges
- **Effects**: Hover effects, transitions, animations
- **Responsive**: Mobile-first approach with `md:` and `lg:` breakpoints

## 🔧 Troubleshooting

### Port 5000 already in use
```bash
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB connection failed
- Ensure MongoDB is running (`mongod`)
- Check `MONGODB_URI` in `backend/.env`
- Try using MongoDB Atlas for cloud database

### Socket.io not connecting
- Verify both servers are running
- Check browser console for errors
- Clear browser cache and reload

### Styling not working
- Run `npm install` in frontend directory
- Delete node_modules and reinstall
- Clear browser cache (Ctrl+Shift+Delete)

### Ports conflicting
- Change `PORT` in `backend/.env`
- Update `REACT_APP_SOCKET_URL` in `frontend/.env`

## 📦 Available Scripts

### Root Level
```bash
npm start               # Run both backend and frontend
npm run backend        # Run only backend
npm run frontend       # Run only frontend
npm run install-all    # Install all dependencies
```

### Backend
```bash
cd backend
npm run dev            # Run with nodemon
npm start              # Run production
npm run seed           # Seed database with sample data
```

### Frontend
```bash
cd frontend
npm start              # Run development server
npm run build          # Build for production
npm run test           # Run tests
```

## 🌐 API Endpoints

### Experts
- `GET /api/experts` - List with pagination
- `GET /api/experts/:id` - Get details
- `POST /api/experts` - Create

### Time Slots
- `GET /api/time-slots/:expertId/slots` - Get available
- `POST /api/time-slots` - Create
- `PATCH /api/time-slots/:id` - Update

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings?email=...` - Get user bookings
- `PATCH /api/bookings/:id/cancel` - Cancel booking

## 📝 Notes

- All components use Tailwind CSS for styling
- Real-time updates powered by Socket.io
- Database transactions prevent double bookings
- Form validation on both client and server
- Responsive design for all screen sizes

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `backend/.env`
2. Build frontend: `cd frontend && npm run build`
3. Deploy backend to cloud (Heroku, AWS, etc.)
4. Deploy frontend to Vercel/Netlify
5. Update environment variables in production
6. Set up CI/CD pipeline
7. Monitor logs and errors

## 📞 Support

For issues or questions, check the console for error messages and review the troubleshooting section above.

Happy coding! 🎉
