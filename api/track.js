// api/track.js - Vercel serverless function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Your actual Google Apps Script URL
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynivPo33rHPU5V26P8twnRWN_hy8ENpTHALsApXJ0J_yArGl2wx1VxJ3lS8_yonlp8HA/exec";
    
    // Extract query parameters
    const { email, campaign, type, destination, sentTime, userAgent, ipAddress } = req.query;
    
    // Get user's real IP address
    const realIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'unknown';
    
    // Get user agent
    const realUserAgent = req.headers['user-agent'] || userAgent || 'unknown';
    
    // Prepare data for Apps Script
    const trackingData = {
      email: email,
      campaign: campaign,
      type: type || 'open',
      destination: destination,
      sentTime: sentTime,
      userAgent: realUserAgent,
      ipAddress: realIP
    };
    
    // Handle click tracking with redirect
    if (type === 'click' && destination) {
      // Track the click asynchronously (don't wait for response)
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData)
      }).catch(err => console.error('Tracking failed:', err));
      
      // Immediate redirect to destination
      const redirectUrl = destination.startsWith('http') ? destination : `https://${destination}`;
      return res.redirect(302, redirectUrl);
    }
    
    // For open tracking (tracking pixel)
    if (type === 'open') {
      // Track the open asynchronously
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData)
      }).catch(err => console.error('Tracking failed:', err));
      
      // Return 1x1 transparent pixel
      const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(200).send(pixel);
    }
    
    // For sent tracking or other types
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData)
    });
    
    const result = await response.json();
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error:', error);
    
    // For click tracking, still redirect even if tracking fails
    if (req.query.type === 'click' && req.query.destination) {
      const redirectUrl = req.query.destination.startsWith('http') ? 
                         req.query.destination : `https://${req.query.destination}`;
      return res.redirect(302, redirectUrl);
    }
    
    // For open tracking, still return pixel even if tracking fails
    if (req.query.type === 'open') {
      const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.setHeader('Content-Type', 'image/gif');
      return res.status(200).send(pixel);
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
