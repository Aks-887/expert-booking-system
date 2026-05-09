import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import ExpertBookings from './pages/ExpertBookings';

function App() {
  return (
    <Router>
      <SocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ExpertList />} />
              <Route path="/expert/:id" element={<ExpertDetail />} />
              <Route path="/expert/:expertId/booking/:slotId" element={<Booking />} />
              <Route path="/booking/:expertId/:slotId" element={<Booking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/expert-bookings/:expertId" element={<ExpertBookings />} />
            </Routes>
          </div>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App;
