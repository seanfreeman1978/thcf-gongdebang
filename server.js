const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3210;
const DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.mp4': 'video/mp4', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
    return true;
  } catch(e) {
    return false;
  }
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  
  // 处理 /admin 和 /admin.html 路由
  if (urlPath === '/admin' || urlPath === '/admin/') {
    serveFile(path.join(DIR, 'admin.html'), res);
    return;
  }
  
  // 根路径 -> 主页面
  if (urlPath === '/' || urlPath === '') {
    serveFile(path.join(DIR, 'index.html'), res);
    return;
  }
  
  // 静态资源
  const filePath = path.join(DIR, urlPath);
  if (!serveFile(filePath, res)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});
