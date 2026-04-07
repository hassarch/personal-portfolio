#!/usr/bin/env node

/**
 * Spotify Refresh Token Generator
 * 
 * This script helps you get a refresh token for the Spotify API
 * 
 * Usage:
 * 1. Run: node get-spotify-token.cjs
 * 2. Follow the instructions to authorize
 * 3. Copy the refresh token to your .env file
 */

const http = require('http');
const url = require('url');
const querystring = require('querystring');

const CLIENT_ID = '2683270022eb46089b2006107bf24f54';
const CLIENT_SECRET = '5a1044cd26004b38a10177b635bc1d05';
const REDIRECT_URI = 'https://www.hassancodes.in/';
const SCOPES = 'user-read-currently-playing';

console.log('\n🎵 Spotify Refresh Token Generator\n');
console.log('Step 1: Opening authorization URL in your browser...\n');

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

console.log('If the browser doesn\'t open, visit this URL:');
console.log(authUrl);
console.log('\n');

// Open browser
const { exec } = require('child_process');
const platform = process.platform;
if (platform === 'darwin') {
  exec(`open "${authUrl}"`);
} else if (platform === 'win32') {
  exec(`start ${authUrl}`);
} else {
  exec(`xdg-open "${authUrl}"`);
}

// Start local server to catch the callback
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const code = parsedUrl.query.code;
  const error = parsedUrl.query.error;

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>Authorization Failed</h1><p>Error: ${error}</p>`);
    console.error('❌ Authorization failed:', error);
    process.exit(1);
  }

  if (code) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>✅ Authorization successful!</h1><p>You can close this window and check your terminal.</p>');

    console.log('✅ Authorization code received!\n');
    console.log('Step 2: Exchanging code for refresh token...\n');

    // Exchange code for refresh token
    const postData = querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const tokenReq = http.request(options, (tokenRes) => {
      let data = '';

      tokenRes.on('data', (chunk) => {
        data += chunk;
      });

      tokenRes.on('end', () => {
        try {
          const tokenData = JSON.parse(data);

          if (tokenData.refresh_token) {
            console.log('✅ Refresh token obtained!\n');
            console.log('📋 Add this to your .env file:\n');
            console.log(`VITE_SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}\n`);
            console.log('Then restart your dev server.\n');
          } else {
            console.error('❌ No refresh token in response:', tokenData);
          }
        } catch (e) {
          console.error('❌ Error parsing response:', e);
        }

        server.close();
        process.exit(0);
      });
    });

    tokenReq.on('error', (e) => {
      console.error('❌ Error:', e);
      server.close();
      process.exit(1);
    });

    tokenReq.write(postData);
    tokenReq.end();
  }
});

server.listen(3000, () => {
  console.log('Waiting for authorization...\n');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('❌ Port 3000 is already in use. Please close other applications using this port.');
  } else {
    console.error('❌ Server error:', e);
  }
  process.exit(1);
});
