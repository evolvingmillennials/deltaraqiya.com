# Delta Al Raqiyya Email Tracking System

## 🎯 Problem Solved
This solution replaces the ugly Google Apps Script URLs in your email tracking with clean, professional URLs using your own domain.

**Before:** `https://script.google.com/macros/s/AKfycbyniv...`  
**After:** `https://deltaraqiya.com/track?email=...`

## 🚀 Quick Setup Guide

### Step 1: Prepare Your Files
Create a new folder on your computer called `deltaraqiya-tracking` and add these files:

```
deltaraqiya-tracking/
├── package.json
├── vercel.json
├── index.html
├── api/
│   └── track.js
└── README.md
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to your project folder**:
   ```bash
   cd deltaraqiya-tracking
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Link to existing project" or create new
   - Select your project settings

4. **Get your Vercel URL**:
   After deployment, Vercel will give you a URL like:
   `https://deltaraqiya-tracking-abc123.vercel.app`

### Step 3: Connect Your Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your domain: `deltaraqiya.com`
   - Add subdomain if needed: `track.deltaraqiya.com`

2. **Update DNS Settings** (in your domain provider):
   ```
   Type: CNAME
   Name: @ (or track)
   Value: cname.vercel-dns.com
   ```

### Step 4: Update Your VBA Code

Replace the tracking base URL in your Excel VBA:

```vb
' OLD URL (ugly):
Const TRACKING_BASE_URL = "https://script.google.com/macros/s/AKfycbyniv..."

' NEW URL (professional):
Const TRACKING_BASE_URL = "https://deltaraqiya.com/track"
' OR use shorter version:
Const TRACKING_BASE_URL = "https://deltaraqiya.com/t"
```

### Step 5: Test Your Setup

Run the VBA test function:
```vb
Sub TestTrackingSystem()
```

Check that:
- ✅ URLs now show as `https://deltaraqiya.com/track?...`
- ✅ Tracking data appears in your Google Sheet
- ✅ Redirects work properly
- ✅ Email opens are tracked

## 📧 How It Works

### Email Flow:
1. **VBA sends email** with tracking URLs using your domain
2. **User sees clean URL** when hovering over links
3. **User clicks link** → Goes to `https://deltaraqiya.com/track?...`
4. **Vercel proxy** receives request and forwards to Google Apps Script
5. **Google Apps Script** processes tracking data
6. **User gets redirected** to your actual website
7. **Tracking data** appears in your Google Sheet

### URL Examples:

**Tracking Pixel (opens):**
```
https://deltaraqiya.com/track?email=user@email.com&campaign=HEX_Brass_Cable_Glands_20250806&type=open
```

**Click Tracking:**
```
https://deltaraqiya.com/track?email=user@email.com&campaign=HEX_Brass_Cable_Glands_20250806&type=click&destination=https://deltaraqiya.com
```

## 🔧 Configuration Options

### Custom Paths
You can use different paths by updating `vercel.json`:
```json
"rewrites": [
  {
    "source": "/track",
    "destination": "/api/track"
  },
  {
    "source": "/t",           // Short version
    "destination": "/api/track"
  },
  {
    "source": "/pixel",       // Alternative
    "destination": "/api/track"
  }
]
```

### Environment Variables
For additional security, you can set environment variables in Vercel:
- `GOOGLE_SCRIPT_URL`: Your Google Apps Script URL
- `ALLOWED_DOMAINS`: Comma-separated list of allowed domains

## 🛠️ Troubleshooting

### Common Issues:

**1. "Domain not working"**
- Check DNS propagation (can take up to 24 hours)
- Verify CNAME record is correct
- Try accessing the Vercel URL directly first

**2. "Tracking not working"**
- Check Google Apps Script is still accessible
- Verify your script URL in `api/track.js`
- Check Vercel function logs

**3. "Redirects not working"**
- Ensure destination URLs include `http://` or `https://`
- Check for URL encoding issues

### Debug Steps:
1. Test Vercel URL directly: `https://your-project.vercel.app/track`
2. Check Vercel function logs in dashboard
3. Test Google Apps Script independently
4. Use VBA Debug.Print to see generated URLs

## 📊 Monitoring

### Vercel Analytics
- View function invocations in Vercel dashboard
- Monitor response times
- Check error rates

### Google Apps Script Logs
- Your original tracking still works
- All data goes to the same Google Sheet
- No changes needed to your spreadsheet

## 🔒 Security Features

- CORS headers properly configured
- User agent forwarding
- IP address tracking
- Rate limiting through Vercel
- Clean URL parameters only

## 💡 Additional Features

### Professional Landing Page
Your domain now shows a professional landing page at `https://deltaraqiya.com`

### Multiple Tracking URLs
- `/track` - Full tracking endpoint
- `/t` - Short tracking endpoint
- Both work identically

### Fallback Handling
- If Google Apps Script is down, redirects still work
- Tracking failures don't break user experience
- Retry logic for improved reliability

## 🚀 Advanced Customization

### Custom Styling
Edit `index.html` to match your branding

### Additional Endpoints
Add more API routes in the `api/` folder

### Analytics Integration
Add Google Analytics, Facebook Pixel, etc.

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify DNS settings
3. Test each component individually
4. Check Google Apps Script permissions

---

## Final Result

Your email recipients will now see:
- **Professional URLs**: `https://deltaraqiya.com/track?...`
- **Clean appearance** when hovering over links
- **Seamless redirects** to your website
- **Same tracking functionality** as before

The ugly Google Apps Script URLs are completely hidden while maintaining all functionality!
