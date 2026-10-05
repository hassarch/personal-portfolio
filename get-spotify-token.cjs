#!/usr/bin/env node

/**
 * Spotify Refresh Token Generator
 *
 * Mints the refresh token that the /api/spotify proxy uses.
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node get-spotify-token.cjs
 *
 * Credentials are read from the environment (or .env) rather than hardcoded,
 * so a client secret never lands in version control. Register the redirect URI
 * printed at startup in the Spotify dashboard, exactly as written.
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Minimal .env reader, so the script needs no dependency on dotenv.
const loadDotEnv = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }
};

loadDotEnv();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Loopback redirects must use the explicit IP, not the `localhost` hostname —
// Spotify rejects the latter under its current redirect-URI rules.
const PORT = 3000;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

// Scopes needed for the Spotify player to work fully:
// - user-read-currently-playing: show what's playing now
// - user-read-recently-played: show last played track when nothing is playing
// - user-read-playback-state: read playback state
// - user-modify-playback-state: play/pause/skip controls
// - user-library-modify: like button
// - user-library-read: check if track is liked
const SCOPES = 'user-read-currently-playing user-read-recently-played user-read-playback-state user-modify-playback-state user-library-modify user-library-read';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Missing credentials.\n');
  console.error('Set them in .env, or inline:\n');
  console.error('  SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node get-spotify-token.cjs\n');
  process.exit(1);
}

console.log('\n🎵 Spotify Refresh Token Generator\n');
console.log(`Redirect URI (must be registered in your Spotify app):\n  ${REDIRECT_URI}\n`);
console.log('Step 1: Opening authorization URL in your browser...\n');

const authUrl =
  'https://accounts.spotify.com/authorize' +
  `?client_id=${CLIENT_ID}` +
  '&response_type=code' +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}`;

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

  // Only handle /callback path
  if (!parsedUrl.pathname.includes('callback')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

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

    // https, not http: the accounts endpoint is TLS-only. A plain http request
    // lands on port 80 and returns a redirect that JSON.parse chokes on, which
    // is why this script could never print a token before.
    const tokenReq = https.request(options, (tokenRes) => {
      let data = '';

      tokenRes.on('data', (chunk) => {
        data += chunk;
      });

      tokenRes.on('end', () => {
        try {
          const tokenData = JSON.parse(data);

          if (tokenData.refresh_token) {
            console.log('✅ Refresh token obtained!\n');
            console.log('📋 Add this to .env for local dev:\n');
            console.log(`SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}\n`);
            console.log('Then add the same value to your Vercel project\'s environment');
            console.log('variables, alongside SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.\n');
          } else {
            console.error('❌ No refresh token in response:', tokenData);
          }
        } catch (e) {
          console.error('❌ Error parsing response:', e);
          console.error('Raw response:', data);
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

server.listen(PORT, '127.0.0.1', () => {
  console.log('Waiting for authorization...\n');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please close other applications using this port.`);
  } else {
    console.error('❌ Server error:', e);
  }
  process.exit(1);
});
