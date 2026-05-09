import React, { createContext, useState, useCallback } from 'react';
import socketService from '../services/socketService';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [slotBookedData, setSlotBookedData] = useState(null);
  const [slotReleasedData, setSlotReleasedData] = useState(null);

  React.useEffect(() => {
    socketService.connect();

    socketService.on('slot-booked', (data) => {
      setSlotBookedData(data);
    });

    socketService.on('slot-released', (data) => {
      setSlotReleasedData(data);
    });

    return () => {
      socketService.off('slot-booked', null);
      socketService.off('slot-released', null);
    };
  }, []);

  const notifyBookingCreated = useCallback((data) => {
    socketService.emit('booking-created', data);
  }, []);

  const notifyBookingCancelled = useCallback((data) => {
    socketService.emit('booking-cancelled', data);
  }, []);

  const value = {
    slotBookedData,
    slotReleasedData,
    notifyBookingCreated,
    notifyBookingCancelled,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
