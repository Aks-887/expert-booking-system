# Real-Time Expert Session Booking System

A full-stack web application for booking expert consultation sessions with real-time updates using Socket.io.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Expert Listing with filters & search                 │
│  - Booking interface                                     │
│  - Real-time slot updates via Socket.io                 │
└─────────────────────────────────────────────────────────┘
                          ↕
              HTTP REST API + WebSocket
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)                 │
│  - Expert management                                     │
│  - Time slot management                                  │
│  - Booking with transaction handling                     │
│  - MongoDB integration                                   │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database                        │
│  - Experts collection                                    │
│  - Time slots collection                                 │
│  - Bookings collection                                   │
└─────────────────────────────────────────────────────────┘
```

## Features

### ✅ Expert Listing Screen
- Display experts with name, category, experience, and rating
- Search experts by name
- Filter by category (Web Development, Mobile Development, UI/UX Design, Data Science, Cloud Architecture)
- Pagination support
- Loading and error states

### ✅ Expert Detail Screen
- Complete expert profile information
- Available time slots grouped by date
- Real-time slot updates when booked by other users
- Slot availability status

### ✅ Booking Screen
- Form with validation (Name, Email, Phone, Notes)
- Display expert and time slot details
- Success confirmation message
- Automatic slot disabling after booking

### ✅ My Bookings Screen
- View all bookings by email
- Display booking status: Pending, Confirmed, Completed, Cancelled
- Cancel pending bookings
- View booking details

## Critical Features

### 🔒 Double Booking Prevention
- MongoDB transactions for atomicity
- Unique compound index on (expertId, date, startTime)
- Race condition handling with database locks
- Real-time slot status synchronization

### ⚡ Real-Time Updates
- Socket.io for bi-directional communication
- Expert rooms for targeted updates
- Instant slot status changes across all connected clients
- Auto-refresh on slot availability changes

### ⚠️ Error Handling
- Comprehensive validation on both frontend and backend
- Meaningful error messages
- Environment-based configuration
- Proper HTTP status codes

## Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **React Router** 6.16.0 - Client routing
- **Axios** 1.5.0 - HTTP client
- **Socket.io Client** 4.7.1 - Real-time communication
- **date-fns** 2.30.0 - Date formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express** 4.18.2 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 7.5.0 - MongoDB ODM
- **Socket.io** 4.7.1 - Real-time server
- **CORS** 2.8.5 - Cross-origin support
- **Joi** 17.11.0 - Data validation
- **Nodemon** - Development auto-reload

## Installation

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd expert-booking-system
```

### Step 2: Install All Dependencies

**Option 1: Using root package.json**
```bash
npm run install-all
```

**Option 2: Manual installation**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

**Backend (.env)**
```bash
cd backend
```

Create `.env` file:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expert-booking
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
```

**Frontend (.env)**
```bash
cd frontend
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 4: Start the Application

**Option 1: Run both servers together (requires concurrently)**
```bash
npm install -g concurrently
npm start
```

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Experts
- `GET /api/experts` - Get all experts (with pagination & filters)
  - Query params: `page`, `limit`, `category`, `search`
- `GET /api/experts/:id` - Get expert details
- `POST /api/experts` - Create expert (admin)

### Time Slots
- `GET /api/time-slots/:expertId/slots` - Get available slots
  - Query params: `date` (optional)
- `POST /api/time-slots` - Create time slots (admin)
- `PATCH /api/time-slots/:id` - Update time slot status

### Bookings
- `POST /api/bookings` - Create a new booking
  - Body: `{ expertId, timeSlotId, clientName, clientEmail, clientPhone, notes }`
- `GET /api/bookings` - Get bookings by email
  - Query params: `email` (required)
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/status` - Update booking status
  - Body: `{ status, meetingLink (optional) }`
- `PATCH /api/bookings/:id/cancel` - Cancel booking

## Database Schema

### Expert
```javascript
{
  name: String (required),
  category: String (enum, required),
  experience: Number (required),
  rating: Number (0-5),
  bio: String,
  hourlyRate: Number (required),
  profileImage: String,
  isActive: Boolean,
  timestamps: true
}
```

### TimeSlot
```javascript
{
  expertId: ObjectId (ref: Expert, required),
  date: Date (required),
  startTime: String (HH:MM format, required),
  endTime: String (HH:MM format, required),
  isBooked: Boolean,
  bookedBy: ObjectId (ref: Booking),
  timestamps: true
}
// Unique index on: (expertId, date, startTime)
```

### Booking
```javascript
{
  expertId: ObjectId (ref: Expert, required),
  timeSlotId: ObjectId (ref: TimeSlot, required),
  clientName: String (required),
  clientEmail: String (required, email format),
  clientPhone: String (required, phone format),
  notes: String,
  status: String (enum: pending, confirmed, completed, cancelled),
  meetingLink: String,
  timestamps: true
}
// Indexes on: clientEmail, expertId
```

## Key Implementation Details

### Race Condition Prevention
```javascript
// Using MongoDB transactions
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Check slot availability
  // Create booking
  // Update time slot
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

### Real-Time Slot Updates
```javascript
// When a booking is created
io.emit('slot-booked', {
  expertId: data.expertId,
  timeSlotId: data.timeSlotId
});

// Frontend listens and updates UI
socket.on('slot-booked', (data) => {
  // Remove slot from available slots
});
```

### Form Validation
```javascript
// Frontend: React form validation
// Backend: Mongoose schema + Joi validation
// Both: Email and phone regex patterns
```

## Development Workflow

1. **Fetch Experts**: Browse all experts with pagination
2. **View Details**: Click on an expert to see available slots
3. **Select Slot**: Real-time slot availability updates via Socket.io
4. **Book Session**: Fill in your details and confirm
5. **Manage Bookings**: View and cancel your bookings anytime

## Testing the Application

### Test Double Booking Prevention
1. Open the app in two browser tabs
2. Go to the same expert's detail page in both
3. Try to book the same time slot simultaneously
4. One will succeed, the other will get an error

### Test Real-Time Updates
1. Open expert detail in two windows
2. Book a slot in one window
3. Watch the slot disappear in the other window immediately

### Test Validation
1. Try submitting booking form with invalid email/phone
2. See validation error messages
3. Correct the input and submit

## Deployment

### Backend Deployment (Heroku/AWS/DigitalOcean)
1. Set up environment variables
2. Use production MongoDB URI
3. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `build` folder
3. Configure API URL in environment variables

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify connection string format

### Socket.io Not Connecting
- Check backend is running on port 5000
- Verify CORS settings
- Check browser console for errors

### Booking Fails
- Verify all required fields are filled
- Check email/phone format
- Ensure slot is still available
- Check browser console for API errors

## Project Structure

```
expert-booking-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── expertController.js
│   │   ├── timeSlotController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Expert.js
│   │   ├── TimeSlot.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── expertRoutes.js
│   │   ├── timeSlotRoutes.js
│   │   └── bookingRoutes.js
│   ├── utils/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── ExpertList.js
│   │   │   ├── ExpertDetail.js
│   │   │   ├── Booking.js
│   │   │   └── MyBookings.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socketService.js
│   │   ├── context/
│   │   │   └── SocketContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── App.css
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── package.json
└── README.md (this file)
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**
