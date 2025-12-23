// FIXED SERVER - Serves all files properly
console.log("🎯 Starting Focus PWA Server...");

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log("📡 Request for: " + req.url);
    
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    // Get file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Set correct content type
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found - try to serve index.html anyway
                console.log("⚠️  File not found: " + filePath + ", serving index.html");
                fs.readFile('./index.html', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading index.html');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data, 'utf-8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ SERVER IS RUNNING ON PORT ' + PORT);
    console.log('='.repeat(60));
    
    // Try to open in browser automatically
    const { exec } = require('child_process');
    exec('start http://localhost:3000', (error, stdout, stderr) => {
        if (error) {
            console.log('💻 Open browser and go to: http://localhost:3000');
        }
    });
    
    // Get IP address
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    console.log('\n📱 FOR YOUR PHONE:');
    console.log('1. Make sure phone and computer are on SAME WiFi');
    console.log('2. Use one of these IP addresses:');
    
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log('   http://' + iface.address + ':' + PORT);
            }
        }
    }
    
    console.log('\n🔍 If above doesn\'t work, find IP manually:');
    console.log('   Windows: Open Command Prompt, type: ipconfig');
    console.log('   Look for "IPv4 Address" under WiFi/Ethernet');
    console.log('\n' + '='.repeat(60));
});