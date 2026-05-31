# QR Code Scanning Libraries - Integration Guide

## 📦 Installed Libraries

### 1. **jsQR** - Image-based QR Code Decoding
- **Purpose**: Decode QR codes from uploaded images or screenshots
- **File Size**: ~5KB (lightweight)
- **Features**: 
  - Read QR codes from image files
  - Works with uploaded images
  - No camera permissions needed
  - Fast and reliable

### 2. **qr-scanner** - Camera-based QR Code Scanning
- **Purpose**: Real-time QR code scanning from device camera
- **Features**:
  - Live camera feed scanning
  - Automatic detection
  - Mobile-friendly
  - Requires camera permissions

---

## ✅ Current Implementation: jsQR (Image Upload)

### How It Works

The **Check Ticket** page (`/check`) now has fully functional QR code scanning:

```
1. User uploads QR code image
2. jsQR library decodes the image
3. Extracts token ID automatically
4. Auto-searches for the token
5. Displays ticket details
```

### User Experience

**Step 1**: Go to `http://localhost:3000/check`

**Step 2**: Click "📱 Scan QR Code" button

**Step 3**: Upload a screenshot of the QR code

**Step 4**: System automatically:
- Decodes the QR code
- Extracts the token ID
- Searches for the ticket
- Displays results instantly

### Code Implementation

```javascript
import jsQR from 'jsqr';

// When user uploads an image
const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

// Extract token ID from QR
const scannedTokenId = decodedQR.data;

// Auto-search for token
const result = await queueApi.getTokenStatus(scannedTokenId);
```

---

## 🚀 Future: Camera-Based Scanning with qr-scanner

To add real-time camera scanning, create a new component:

### Installation ✅ (Already Done)
```bash
npm install qr-scanner
```

### Example: Camera Scanning Component

```javascript
import QrScanner from 'qr-scanner';

function CameraQRScanner() {
  const [scannedResult, setScannedResult] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        setScannedResult(result.data);
        // Auto-search for token with result.data
      },
      {
        onDecodeError: (error) => {
          // Handle decoding errors
        },
        preferredCamera: 'environment', // Back camera
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start();

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, []);

  return (
    <div className="camera-scanner">
      <video ref={videoRef} style={{ width: '100%' }} />
      {scannedResult && <div>Token: {scannedResult}</div>}
    </div>
  );
}
```

---

## 📊 Comparison: jsQR vs qr-scanner

| Feature | jsQR | qr-scanner |
|---------|------|-----------|
| **QR from Images** | ✅ Yes | ✅ Yes |
| **Live Camera Scanning** | ❌ No | ✅ Yes |
| **File Size** | 5KB | 80KB |
| **Setup Complexity** | Simple | Moderate |
| **Camera Permissions** | ❌ Not needed | ✅ Required |
| **Browser Support** | All | Most modern |
| **Performance** | Fast | Moderate |
| **Best For** | Image upload | Real-time scanning |

---

## 🎯 Current Implementation Details

### File: `client/src/pages/CheckTicket.jsx`

**Key Changes:**
1. ✅ Imported `jsQR` library
2. ✅ Enhanced `handleQRScan()` function
3. ✅ Added image processing
4. ✅ Added error handling
5. ✅ Auto-search on successful scan
6. ✅ Added scanning state indicator

**Functions:**
- `handleQRScan()` - Process uploaded image
- `jsQR()` - Decode QR code data
- Auto-triggers token search when QR is decoded

### File: `client/src/styles/CheckTicket.css`

**New Styles:**
- `.qr-hint` - Help text below QR button
- `.qr-file-input:disabled` - Disable state during scanning

---

## 🔧 How to Use: For End Users

### Method 1: Upload QR Code Image (Current)
1. Go to `/check`
2. Click "📱 Scan QR Code"
3. Select QR code image from phone
4. System reads and shows ticket

### Method 2: Manual Token ID Entry (Current)
1. Go to `/check`
2. Enter token ID in search box
3. Click "Search"
4. View ticket details

---

## 🚀 How to Add Camera Scanning

When you're ready to add live camera scanning:

### Step 1: Create new component

```bash
touch client/src/pages/QRCameraScanner.jsx
touch client/src/styles/QRCameraScanner.css
```

### Step 2: Implement camera scanning component

```javascript
// Import QrScanner (already installed)
import QrScanner from 'qr-scanner';
```

### Step 3: Add route to App.jsx

```javascript
import QRCameraScanner from './pages/QRCameraScanner';

// In routes:
<Route path="/scan-camera" element={<QRCameraScanner />} />
```

### Step 4: Add navigation link

```javascript
<Link to="/scan-camera" className="nav-link">
  📷 Camera Scan
</Link>
```

---

## 📱 Mobile Optimization

### For Image Upload (jsQR)
✅ Works great on mobile
- Users take screenshot of QR
- Upload from gallery
- Very reliable

### For Camera Scanning (qr-scanner)
✅ Excellent on mobile
- Uses device camera
- Real-time scanning
- Great UX
- Requires camera permission

---

## 🎓 Technical Details

### QR Code Data Format

The QR codes in this system encode:
- **Data**: Token ID (e.g., `0.123456789`)
- **Size**: 200x200 pixels
- **Error Correction**: High (Level H)

### QR Code Decoding Process

1. **Read Image** → Get pixel data
2. **Extract Pattern** → Identify QR structure
3. **Decode Data** → Extract token ID
4. **Return Result** → String format

### Error Handling

```javascript
if (decodedQR && decodedQR.data) {
  // Valid QR code found
} else {
  // Invalid or unreadable QR
  setError('Unable to read QR code...');
}
```

---

## 🐛 Troubleshooting

### Issue: "Unable to read QR code"

**Causes:**
- Image quality too low
- QR code partially cut off
- Wrong file format
- Lighting issues

**Solutions:**
1. Try a clearer image
2. Make sure entire QR is visible
3. Use PNG/JPG format
4. Better lighting conditions
5. Enter token ID manually

### Issue: Camera not working (if implementing camera scanner)

**Causes:**
- Camera permissions denied
- Browser doesn't support camera access
- No camera device found

**Solutions:**
1. Grant camera permission in settings
2. Use modern browser (Chrome, Firefox, Safari)
3. Use HTTPS connection
4. Check if device has camera

---

## 📚 Library Documentation

### jsQR
- **NPM**: `npm install jsqr`
- **Docs**: https://github.com/cozmo/jsQR
- **GitHub**: https://github.com/cozmo/jsQR

### qr-scanner
- **NPM**: `npm install qr-scanner`
- **Docs**: https://github.com/yuxiaohui78/QrScanner
- **GitHub**: https://github.com/yuxiaohui78/QrScanner

---

## 🎉 Current Features

✅ **Image Upload QR Scanning**
- Upload QR code screenshot
- Auto-decode token ID
- Auto-search ticket
- Error handling

✅ **Manual Token Entry**
- Type token ID directly
- Search button
- Clear results

✅ **Real-time Status Updates**
- WebSocket integration
- Auto-refresh on token call
- Live status changes

---

## 🔮 Future Enhancements

1. **Camera Live Scanning**
   - Use qr-scanner library (already installed)
   - Real-time detection
   - Toggle between camera and upload

2. **Barcode Support**
   - Scan patient ID barcodes
   - Scan doctor/staff badges
   - Multi-code detection

3. **Bulk Token Scanning**
   - Scan multiple QR codes
   - Process batch searches
   - Export results

4. **Offline Support**
   - Cache scanned codes
   - Local storage
   - Sync when online

---

## 📝 Summary

### What's Installed
- ✅ **jsQR** - Image QR decoding (ACTIVE)
- ✅ **qr-scanner** - Camera scanning (READY TO USE)

### What's Working
- ✅ Upload QR code image
- ✅ Auto-decode token ID
- ✅ Auto-search ticket
- ✅ Display results
- ✅ Real-time updates

### What's Ready for Implementation
- ⏳ Live camera scanning
- ⏳ Barcode scanning
- ⏳ Multiple format support

---

## 🧪 Testing QR Scanning

### To Test:

1. **Book a Token**
   - Go to `http://localhost:3000/`
   - Fill in name and department
   - Click "Book Token"

2. **Get QR Code**
   - QR code appears on screen
   - Click "Download QR Code" to save

3. **Test Upload Scanning**
   - Go to `http://localhost:3000/check`
   - Click "📱 Scan QR Code"
   - Upload the QR image you downloaded
   - System reads it and shows ticket ✅

4. **Test Manual Entry**
   - Go to `http://localhost:3000/check`
   - Enter the token ID
   - Click "Search"
   - Verify ticket loads ✅

---

**Both scanning libraries are now ready to use! Choose the method that best fits your needs.** 🎉
