# Expert Booking System Backend

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expert-booking
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```

### Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### API Endpoints

#### Experts
- `GET /api/experts` - Get all experts with pagination and filters
- `GET /api/experts/:id` - Get expert details
- `POST /api/experts` - Create new expert

#### Time Slots
- `GET /api/time-slots/:expertId/slots` - Get available slots for expert
- `POST /api/time-slots` - Create time slots
- `PATCH /api/time-slots/:id` - Update time slot

#### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get bookings by email
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/status` - Update booking status
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Features
- Real-time slot updates using Socket.io
- MongoDB transactions for race condition prevention
- Comprehensive error handling
- CORS support
- Pagination and filtering
