# Expert Booking System — Project Explanation (Frontend + Backend)

> This document explains the purpose, architecture, file structure, and key flows of the project.

---

## 1) Overview
The project is a **real-time expert session booking system**.

- **Frontend (React)**: Lets users browse experts, view availability, and create bookings. Experts can log in and confirm pending bookings.
- **Backend (Node/Express + MongoDB)**: Provides REST APIs for experts, time slots, and bookings, and supports **real-time updates** via WebSockets.

---

## 2) Tech Stack
### Frontend
- React (React Router for navigation)
- TailwindCSS for styling
- Axios for HTTP requests
- Socket.IO client for real-time updates
- Custom CSS animations and UI components

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO (or compatible socket layer)

---

## 3) High-level Architecture

### Frontend responsibilities
1. Fetch and display experts (with filtering/pagination).
2. Fetch an expert’s details + grouped time slots.
3. Allow creating a booking for a specific slot.
4. Provide expert login and show pending bookings.
5. Real-time update: when a slot is booked/released by another user, expert pages update automatically.

### Backend responsibilities
1. CRUD APIs for **Experts**, **TimeSlots**, and **Bookings**.
2. Booking status lifecycle:
   - pending → confirmed → completed/cancelled (depending on backend logic)
3. Socket events to broadcast changes to experts who are currently viewing their availability.

---

## 4) Real-time Flow (Sockets)
### When user books a slot
1. User selects a time slot from `ExpertDetail` and navigates to `Booking`.
2. User submits the booking.
3. Backend creates the booking and emits a socket event to the expert room.
4. `ExpertDetail` listens for the event and removes the booked slot from the UI.

### When user cancels / slot released
1. Backend releases slot / updates booking.
2. Backend emits a “slot released” style event.
3. `ExpertDetail` refreshes slots and/or re-adds the released slot.

> Implementation detail:
- The frontend uses `SocketProvider` and `useSocket()`.
- `socketService.joinExpertRoom(expertId)` and `leaveExpertRoom(expertId)` are used by `ExpertDetail`.

---

## 5) Frontend: File Structure & Roles

### Entry & App shell
- `frontend/src/index.js`
  - React root mounting
  - Imports global CSS
  - Imports advanced animation/effects CSS:
    - `src/styles/animations.css`
    - `src/styles/globalEffects.css`

- `frontend/src/App.js`
  - Router setup
  - Wraps app with `SocketProvider`
  - Layout container:
    - Navbar
    - Route pages

### Shared UI components
- `frontend/src/components/Navbar.js`
  - Navbar links: Experts, My Bookings
  - Floating “Expert Login” button
  - Modal form for expert login
  - Writes `localStorage.expertLogin` so expert dashboard can auto-load identity

- `frontend/src/components/BBTransition/BBTransition.js`
  - Lightweight wrapper that applies the `.bb-reload` animation on mount
  - Optional stagger effect through `.bb-stagger`

- `frontend/src/components/BBGlitchButton/BBGlitchButton.js`
  - Adds a scan/glitch-like hover overlay
  - Uses `.bb-press` for a more physical press effect

### Pages
- `frontend/src/pages/ExpertList.js`
  - Displays expert cards
  - Fetches list with pagination/filter/search
  - Loading state uses shimmer effect
  - (Updated) adds `.bb-backdrop` to make the page visually “alive”

- `frontend/src/pages/ExpertDetail.js`
  - Fetches expert by id
  - Joins Socket room for real-time slot updates
  - Fetches grouped time slots and renders date sections
  - Slot buttons navigate to booking route

- `frontend/src/pages/Booking.js`
  - Reads route parameters for `expertId` and `slotId`
  - Loads the chosen slot + expert info
  - Provides client input form and submits booking
  - On success:
    - alerts the user
    - navigates to `/my-bookings`

- `frontend/src/pages/MyBookings.js`
  - Allows searching bookings by client email
  - Displays bookings including status and notes
  - Allows cancelling bookings (except for completed/cancelled)

- `frontend/src/pages/ExpertBookings.js`
  - Expert dashboard for confirming pending bookings
  - Uses `localStorage.expertLogin` for auto-fill when coming from Navbar
  - Confirms a booking (optimistic UI update)

### Services
- `frontend/src/services/api.js`
  - Axios instance with base URL
  - Exports API objects:
    - `expertAPI`
    - `timeSlotsAPI`
    - `bookingsAPI`

- `frontend/src/services/socketService.js`
  - Socket room join/leave helpers

### Styling
- `frontend/src/styles/animations.css`
  - Advanced animation and transition CSS helpers:
    - `.bb-pageEnter`
    - `.bb-stagger`
    - `.bb-glowCard`
    - `.bb-shimmer`
    - `.bb-pop`
    - `.bb-reload`
    - reduced-motion support

- `frontend/src/styles/globalEffects.css`
  - `.bb-backdrop` animated gradient + subtle noise overlay

> Note: Tailwind continues to handle layout/typography; these custom classes add “premium motion”.

---

## 6) Backend: File Structure & Roles

### Server and configuration
- `backend/server.js`
  - Express app setup
  - API route mounting
  - Socket.IO initialization

- `backend/config/database.js`
  - MongoDB connection

### Controllers
- `backend/controllers/expertController.js`
  - Get experts, get expert by id, login logic

- `backend/controllers/timeSlotController.js`
  - Get time slots for an expert (grouped by date)
  - Create/update time slots

- `backend/controllers/bookingController.js`
  - Create booking
  - Get bookings by email
  - Get bookings by expert id
  - Update booking status (confirm)
  - Cancel booking / release slot

### Models
- `backend/models/Expert.js`
- `backend/models/TimeSlot.js`
- `backend/models/Booking.js`

### Routes
- `backend/routes/expertRoutes.js`
- `backend/routes/timeSlotRoutes.js`
- `backend/routes/bookingRoutes.js`

### Middleware
- `backend/middleware/errorHandler.js`
  - Centralized API error handling

---

## 7) Key UX Enhancements (Animation/Transition System)

### Goals
- Reduce “boring” static UI by adding:
  - page entry transitions
  - hover glow
  - shimmer loading
  - reload-style feedback on navigation and submit flows
  - staggered reveals for lists

### Implemented elements
- `.bb-reload` / `BBTransition`
  - Used for “reload animation” effect on mount.

- `.bb-backdrop`
  - Applied to pages like `ExpertList` for a more premium background.

- `.bb-shimmer`
  - Replaced spinner-style loaders with an animated gradient shimmer.

- `.bb-press` + `.bb-glitch-button`
  - Added physical press + scan overlay feedback to buttons.

---

## 8) Important Notes / Known Gaps
1. Animation foundation is implemented, but not every page may yet use all effects.
   - Current upgrade focus includes `ExpertList` and reusable CSS/components.

2. Some loading states are still basic in pages other than `ExpertList`.
   - Next iteration should apply the same shimmer + stagger pattern consistently.

3. Confirm flow uses optimistic updates in `ExpertBookings`.
   - UI “pop” can be further applied to confirmed item transitions.

---

## 9) How to Run (Quick)
Refer to:
- `SETUP_AND_RUN.md`
- `frontend/README.md`
- `backend/README.md`

At root (`g:/Vedaz`):
- `npm run install-all`
- `npm start`

---

## 10) Suggested Next Enhancements (If you want “next level” everywhere)
Apply the same motion kit across remaining pages:
- `Navbar.js`
  - modal entrance (bb-pageEnter)
  - button hover improvements (BBGlitchButton)

- `ExpertDetail.js`
  - stagger time-slot buttons
  - card/image parallax-like hover

- `Booking.js`
  - form field focus animations
  - submit confirm pop (`.bb-pop`) + route transition (`.bb-reload`)

- `MyBookings.js`
  - booking card stagger
  - cancel button feedback animation

- `ExpertBookings.js`
  - use `.bb-stagger` on pending list
  - apply `.bb-pop` when confirmed

---

## Appendix: CSS Classes Cheat Sheet
- `.bb-pageEnter` — page entry reveal
- `.bb-stagger` — stagger children items
- `.bb-backdrop` — animated premium background + noise
- `.bb-shimmer` — shimmer loader background
- `.bb-glowCard` — radial glow on hover (needs `::before` target)
- `.bb-pop` — confirmation pop
- `.bb-reload` — route/mount reload animation

