const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 8765;
const DIST_DIR = path.join(__dirname, '../dist');

// Получаем все маршруты
const getIdsFromDir = (dir) => {
  const directory = path.join(__dirname, '../', dir);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).map(file => path.basename(file, '.md'));
};

const articleRoutes = getIdsFromDir('public/content/articles').map(id => `/article/${id}`);
const authorRoutes = getIdsFromDir('public/content/authors').map(id => `/author/${id}`);
const issueRoutes = getIdsFromDir('public/content/issues').map(id => `/issue/${id}`);

const routes = [
  '/',
  '/works',
  '/authors/writers',
  '/authors/artists',
  '/archive',
  '/about',
  '/search',
  '/current_issue',
  ...articleRoutes,
  ...authorRoutes,
  ...issueRoutes,
];

// Простой HTTP сервер для раздачи статики
const startServer = () => {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
      
      // Для SPA маршрутов всегда отдаем index.html
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath);
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ico': 'image/x-icon',
        '.md': 'text/markdown',
      };

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(data);
      });
    });

    server.listen(PORT, () => {
      console.log(`[Prerender] Server started on port ${PORT}`);
      resolve(server);
    });
  });
};

const prerender = async () => {
  console.log(`[Prerender] Starting prerender for ${routes.length} routes...`);
  
  let server;
  let browser;
  
  try {
    server = await startServer();
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    for (const route of routes) {
      const url = `http://localhost:${PORT}${route}`;
      const outputPath = path.join(DIST_DIR, route === '/' ? 'index.html' : `${route}/index.html`);
      const outputDir = path.dirname(outputPath);

      try {
        console.log(`[Prerender] Rendering: ${route}`);
        
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        
        // Ждем немного для выполнения JS
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const html = await page.content();
        
        // Создаем директорию если не существует
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`[Prerender] ✓ Saved: ${outputPath}`);
        
      } catch (err) {
        console.error(`[Prerender] ✗ Error rendering ${route}:`, err.message);
      }
    }

    console.log('[Prerender] Completed!');
    
  } catch (err) {
    console.error('[Prerender] Fatal error:', err.message);
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
};

prerender();
