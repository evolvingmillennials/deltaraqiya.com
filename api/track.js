/**
 * Vercel API Route - Email Tracking Proxy
 * File: api/track.js
 * This acts as a middleman between your emails and Google Apps Script
 */

export default async function handler(req, res) {
  // Your actual Google Apps Script URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynivPo33rHPU5V26P8twnRWN_hy8ENpTHALsApXJ0J_yArGl2wx1VxJ3lS8_yonlp8HA/exec";
  
  try {
    // Handle CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent, Referer');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Extract parameters from both query and body
    const params = { ...req.query, ...(req.body || {}) };
    
    // Add user agent and IP information
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || '';
    
    // Prepare data for Google Apps Script
    const trackingData = {
      ...params,
      userAgent: userAgent,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString()
    };
    
    console.log('Tracking request:', {
      method: req.method,
      type: params.type,
      email: params.email,
      campaign: params.campaign,
      destination: params.destination,
      userAgent: userAgent.substring(0, 100) + '...',
      ip: ipAddress
    });
    
    // Handle click tracking with redirect
    if (params.type === 'click' && params.destination) {
      // Forward tracking data to Google Apps Script (fire and forget)
      forwardToGoogleScript(GOOGLE_SCRIPT_URL, trackingData);
      
      // Immediate redirect to destination
      const destination = params.destination.startsWith('http') ? 
                         params.destination : 
                         'https://' + params.destination;
      
      return res.redirect(302, destination);
    }
    
    // For open tracking (pixel)
    if (params.type === 'open') {
      // Forward tracking data to Google Apps Script
      const scriptResponse = await forwardToGoogleScript(GOOGLE_SCRIPT_URL, trackingData);
      
      // Return 1x1 transparent pixel
      const pixelBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', pixelBuffer.length);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.send(pixelBuffer);
    }
    
    // For other types or direct API calls
    const scriptResponse = await forwardToGoogleScript(GOOGLE_SCRIPT_URL, trackingData);
    
    return res.status(200).json({
      success: true,
      message: 'Tracking processed',
      data: scriptResponse
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    
    // For click tracking, still redirect even if tracking fails
    if (params.type === 'click' && params.destination) {
      const destination = params.destination.startsWith('http') ? 
                         params.destination : 
                         'https://' + params.destination;
      return res.redirect(302, destination);
    }
    
    // For open tracking, still return pixel even if tracking fails
    if (params.type === 'open') {
      const pixelBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );
      res.setHeader('Content-Type', 'image/png');
      return res.send(pixelBuffer);
    }
    
    return res.status(500).json({
      success: false,
      error: 'Tracking failed',
      message: error.message
    });
  }
}

// Helper function to forward data to Google Apps Script
async function forwardToGoogleScript(scriptUrl, data) {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': data.userAgent || 'Vercel-Proxy/1.0'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Google Script responded with ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Google Script response:', result);
    return result;
    
  } catch (error) {
    console.error('Failed to forward to Google Script:', error);
    // Don't throw - we want to continue with redirect/pixel even if tracking fails
    return { success: false, error: error.message };
  }
}
