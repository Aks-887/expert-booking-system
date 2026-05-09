require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

// Import routes
const expertRoutes = require('./routes/expertRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store io instance for controllers
app.set('io', io);

// Routes
app.use('/api/experts', expertRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a booking is created
  socket.on('booking-created', (data) => {
    console.log('Booking created event:', data);
    // Broadcast to all connected clients
    io.emit('slot-booked', {
      expertId: data.expertId,
      timeSlotId: data.timeSlotId,
      message: 'A new booking has been made',
    });
  });

  // When a booking is cancelled
  socket.on('booking-cancelled', (data) => {
    console.log('Booking cancelled event:', data);
    io.emit('slot-released', {
      expertId: data.expertId,
      timeSlotId: data.timeSlotId,
      message: 'A booking has been cancelled',
    });
  });

  // Listen for slot status updates
  socket.on('join-expert-room', (expertId) => {
    socket.join(`expert-${expertId}`);
    console.log(`Client joined room: expert-${expertId}`);
  });

  socket.on('leave-expert-room', (expertId) => {
    socket.leave(`expert-${expertId}`);
    console.log(`Client left room: expert-${expertId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
