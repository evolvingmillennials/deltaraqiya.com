# Delta Al Raqiyya Email Tracking System

> Professional email tracking with URL masking using Vercel serverless functions

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/deltaraqiya-email-tracking)

## 🎯 Overview

This project provides a professional email tracking solution that masks Google Apps Script URLs with clean, branded Vercel URLs. Perfect for email marketing campaigns where you want to maintain a professional appearance while tracking opens and clicks.

**Before:** `https://script.google.com/macros/s/very-long-google-url.../exec?...`  
**After:** `https://deltaraqiya.vercel.app/track?email=...&campaign=...`

## ✨ Features

- 🔗 **URL Masking**: Clean, professional URLs instead of Google Apps Script URLs
- 📊 **Email Tracking**: Track email opens, clicks, and sent status
- 🚀 **Fast Redirects**: Instant redirects with global CDN performance
- 📈 **Analytics Integration**: Full integration with existing Google Sheets tracking
- 🛡️ **Reliable**: Built on Vercel's 99.99% uptime infrastructure
- 💰 **Free**: No cost for typical email tracking volumes

## 🏗️ Architecture

```
Email Campaign (VBA/Excel)
         ↓
Clean Vercel URLs (deltaraqiya.vercel.app)
         ↓
Vercel Serverless Function
         ↓
Google Apps Script (existing tracking)
         ↓
Google Sheets (tracking data storage)
```

## 📁 Project Structure

```
deltaraqiya-email-tracking/
├── api/
│   └── track.js          # Main serverless tracking function
├── vercel.json           # Vercel deployment configuration
├── package.json          # Project dependencies and metadata
├── README.md            # This file
└── .gitignore           # Git ignore rules
```

## 🚀 Quick Deploy

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/deltaraqiya-email-tracking)

### Manual Deployment

1. **Clone this repository:**
   ```bash
   git clone https://github.com/your-username/deltaraqiya-email-tracking.git
   cd deltaraqiya-email-tracking
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel --prod --name deltaraqiya
   ```

5. **Your tracking URL will be:**
   ```
   https://deltaraqiya.vercel.app
   ```

## ⚙️ Configuration

### 1. Update Google Apps Script URL

Edit `api/track.js` and replace the `APPS_SCRIPT_URL` with your actual Google Apps Script URL:

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

### 2. Update VBA Code

In your Excel VBA code, update the base URL:

```vba
Const VERCEL_BASE_URL = "https://deltaraqiya.vercel.app"
```

## 📊 Usage Examples

### Tracking Pixel (Email Opens)
```
https://deltaraqiya.vercel.app/track?email=user@example.com&campaign=summer2024&type=open
```

### Click Tracking
```
https://deltaraqiya.vercel.app/track?email=user@example.com&campaign=summer2024&type=click&destination=https://deltaraqiya.com
```

### Sent Tracking
```
https://deltaraqiya.vercel.app/track?email=user@example.com&campaign=summer2024&type=sent&sentTime=2024-01-01%2012:00:00
```

## 🧪 Testing

### Test the API directly:

1. **Open Tracking Test:**
   ```bash
   curl "https://deltaraqiya.vercel.app/track?email=test@example.com&campaign=test&type=open"
   ```
   Expected: Returns 1x1 transparent pixel

2. **Click Tracking Test:**
   ```bash
   curl -I "https://deltaraqiya.vercel.app/track?email=test@example.com&campaign=test&type=click&destination=https://deltaraqiya.com"
   ```
   Expected: Returns 302 redirect

3. **VBA Integration Test:**
   Run the `TestTrackingSystemWithVercel()` function in your Excel VBA

## 📈 Monitoring

### Vercel Dashboard
- Monitor function invocations
- View response times and errors
- Check deployment status

### Google Apps Script Logs
- Your existing Google Sheets tracking continues to work
- All tracking data is preserved
- No changes needed to your spreadsheet

## 🔧 Customization

### Custom Tracking Endpoints

Modify `vercel.json` to add custom URL patterns:

```json
{
  "rewrites": [
    {
      "source": "/t/:path*",
      "destination": "/api/track"
    },
    {
      "source": "/email/:path*", 
      "destination": "/api/track"
    }
  ]
}
```

### Add Analytics

Extend `api/track.js` to include additional analytics:

```javascript
// Add Google Analytics, Mixpanel, etc.
if (type === 'click') {
  analytics.track('email_click', { email, campaign });
}
```

## 🛡️ Security

- ✅ CORS headers properly configured
- ✅ Input validation and sanitization
- ✅ Error handling for failed requests
- ✅ Graceful fallbacks if backend is unavailable

## 📝 API Documentation

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Recipient email address |
| `campaign` | string | Yes | Campaign identifier |
| `type` | string | No | Tracking type: `open`, `click`, `sent` (default: `open`) |
| `destination` | string | No | Redirect URL for click tracking |
| `sentTime` | string | No | Email sent timestamp |

### Response Types

- **Open Tracking**: Returns 1x1 transparent GIF
- **Click Tracking**: Returns 302 redirect to destination
- **Sent Tracking**: Returns JSON response

## 🚨 Troubleshooting

### Common Issues

1. **Vercel URL not working**
   - Check deployment status in Vercel dashboard
   - Verify project name is correct

2. **Tracking not recording**
   - Verify Google Apps Script URL in `api/track.js`
   - Check Google Apps Script permissions
   - Review Vercel function logs

3. **Redirects not working**
   - Ensure destination URLs include `http://` or `https://`
   - Check for URL encoding issues

### Debug Mode

Add logging to `api/track.js`:

```javascript
console.log('Received request:', {
  email, campaign, type, destination
});
```

View logs in Vercel dashboard > Functions tab.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About Delta Al Raqiyya

Delta Al Raqiyya is a leading supplier of industrial electrical components and cable management solutions. Visit us at [deltaraqiya.com](https://deltaraqiya.com).

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/deltaraqiya-email-tracking/issues)
- 📧 **Email**: info@deltaraqiya.com
- 🌐 **Website**: [deltaraqiya.com](https://deltaraqiya.com)

---

**Built with ❤️ by Delta Al Raqiyya Team**
