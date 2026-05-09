# Expert Booking System Frontend

A React-based web application for booking expert consultation sessions in real-time.

## Features

- **Expert Listing**: Browse and search experts with filtering by category
- **Expert Details**: View expert profiles with available time slots
- **Real-Time Updates**: Socket.io integration for real-time slot availability
- **Booking Management**: Create and manage bookings
- **My Bookings**: View and cancel your bookings
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Running the Application

**Development:**

```bash
npm start
```

The application will open at `http://localhost:3000`

**Build for Production:**

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components (Expert List, Booking, etc.)
├── services/         # API and Socket.io services
├── context/          # React Context for global state
├── styles/           # CSS files
└── App.js            # Main App component
```

## Pages

### 1. Expert Listing (/
- Display all experts with pagination
- Search by expert name
- Filter by category
- View expert ratings and experience

### 2. Expert Detail (/expert/:id)
- View detailed expert information
- See available time slots grouped by date
- Real-time slot updates via Socket.io

### 3. Booking (/booking/:expertId/:slotId)
- Book a time slot with expert
- Form validation for name, email, phone
- Add optional notes
- Success confirmation

### 4. My Bookings (/my-bookings)
- View all bookings by email
- Display booking status (Pending, Confirmed, Completed, Cancelled)
- Cancel pending bookings

## Technologies Used

- **React** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **CSS3** - Styling

## API Integration

The frontend communicates with the backend through:

1. **REST API** - For CRUD operations
2. **Socket.io** - For real-time slot updates

## Real-Time Features

- Automatic slot removal when booked by another user
- Real-time status updates for bookings
- Live availability display

## Error Handling

- User-friendly error messages
- Form validation before submission
- Network error handling
- Loading states for all async operations

## Notes

- The backend server must be running on `http://localhost:5000` for the app to work
- Email is used as a unique identifier for retrieving bookings
- Time slot selection is managed in real-time to prevent double bookings
