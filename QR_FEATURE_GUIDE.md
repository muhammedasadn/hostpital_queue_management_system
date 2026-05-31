# QR Code Ticket Scanning Feature

## Overview
This feature allows patients to scan their QR code or manually enter their token ID to check their ticket status in real-time.

## What's New

### 1. **Check Ticket Page** (`/check`)
A new page where patients can:
- **Manual Token Entry**: Enter their token ID to search for their ticket
- **QR Code Upload**: Upload/scan a QR code image (future enhancement with QR library)
- **Real-time Status Updates**: See live updates when their token is called
- **Queue Position**: View their current position in the queue

### 2. **QR Code Enhancement**
- QR codes now encode only the token ID (not the token number)
- Scannable QR codes that can be read by standard QR scanner apps
- Download QR code as PNG image for backup

### 3. **Navigation Menu**
Added a sticky navigation bar at the top with quick access to:
- 🏥 Hospital Queue (Home/Logo)
- Book Token - Patient booking page
- Check Ticket - Ticket status checking page
- Queue Status - View all queues
- Admin - Admin dashboard

## How It Works

### For Patients:
1. **Get a Token**: Go to "/" and book a token by entering name and selecting department
2. **Receive QR Code**: A unique QR code is generated and displayed
3. **Check Status**: 
   - Option A: Go to "/check" and enter the token ID shown on the ticket
   - Option B: Scan the QR code with a QR scanner app or upload it on the check page
4. **Real-time Updates**: Once token is called, status updates automatically via WebSocket

### Ticket Status Display Shows:
- **Token Number**: Unique identifier (e.g., 2, 3, 4)
- **Department**: Which department (General, Cardiology, etc.)
- **Patient Name**: Name entered during booking
- **Position in Queue**: Current position (1, 2, 3...)
- **Booking Time**: When the token was booked
- **Status Badge**: Visual indicator of status
  - 🟠 Waiting in Queue
  - 🔵 Called to Counter
  - 🟢 Completed
  - 🔴 Cancelled

## Status Meanings

- **Waiting**: Token is in the queue
- **Called**: Token has been called to a counter (alert shown)
- **Completed**: Service completed
- **Cancelled**: Booking was cancelled

## Routes

```
/ - Patient Booking (Book Token)
/check - Check Ticket Status (NEW)
/status - View All Queues
/admin - Admin Dashboard
```

## Technical Details

### Frontend Components:
- **CheckTicket.jsx**: Main page for ticket lookup and display
- **QRDisplay.jsx**: Enhanced with token ID encoding
- **App.jsx**: Updated with Navigation component and new route
- **CheckTicket.css**: Comprehensive styling for the new page
- **App.css**: Navigation bar styling

### Backend:
- Uses existing `/api/token/:tokenId` endpoint to fetch ticket details
- WebSocket events for real-time updates when status changes

### Features Used:
- Real-time WebSocket communication (Socket.IO)
- QR code generation and encoding
- Responsive design for mobile and desktop
- Live status updates via socket events

## Future Enhancements

1. **QR Scanner Library Integration**
   - Install `jsQR` or `qr-scanner` npm package
   - Enable camera-based QR scanning
   - Automatic token ID extraction from QR

2. **SMS Notifications**
   - Send token updates via SMS
   - Notify when token is called

3. **SMS QR Code Reading**
   - Send QR code to patient via SMS
   - Patient can tap to enter check page

4. **Waiting Time Prediction**
   - Estimate wait time based on queue position
   - Show updated wait time

5. **Push Notifications**
   - Alert patient when token is called
   - Even if page is not open

## How to Test

### Test the Booking Flow:
1. Go to http://localhost:3000/
2. Enter patient name (e.g., "John Doe")
3. Select department (e.g., "General")
4. Click "Book Token"
5. Copy the token ID (appears in the display)

### Test the Check Ticket Feature:
1. Go to http://localhost:3000/check
2. Paste the token ID you copied
3. Click "Search"
4. View ticket details including position and status

### Test Real-time Updates:
1. Have two browser windows open
2. In first window: Book a token and note the token ID
3. In second window: Go to admin dashboard and call the token
4. In first window's check page: Status updates automatically to "Called to Counter"

## API Endpoints Used

```
GET /api/token/:tokenId - Get token status
GET /api/queues - Get all queues
```

## CSS Classes Reference

### CheckTicket Component:
- `.check-ticket` - Main container
- `.search-form` - Search form wrapper
- `.ticket-display` - Ticket information display
- `.ticket-status-badge` - Status indicator badge
- `.ticket-info-grid` - Information grid layout
- `.empty-state` - Empty state message

### Navigation Component:
- `.main-nav` - Navigation bar
- `.nav-container` - Navigation container
- `.nav-logo` - Logo/brand
- `.nav-links` - Navigation links
- `.nav-link` - Individual link
- `.nav-link.active` - Active route indicator

## Notes

- Token data persists only during server runtime (mock database)
- Refresh page to see latest status
- WebSocket connection required for real-time updates
- Mobile responsive design included
- Gradient design consistent with other pages
