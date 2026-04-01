import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentBase = path.join(process.cwd(), 'public/content');
const outputSitemap = path.join(process.cwd(), 'public/sitemap.xml');
const SITE_URL = 'https://yourdomain.com';

// Список статических путей
const staticRoutes = [
  { path: '/', priority: '1.0' },
  { path: '/works', priority: '0.8' },
  { path: '/authors', priority: '0.8' },
  { path: '/archive', priority: '0.8' },
  { path: '/about', priority: '0.8' },
  { path: '/search', priority: '0.8' },
  { path: '/current_issue', priority: '0.8' }
];

const getFileDate = (filePath, id) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    
    if (data.date) {
      return new Date(data.date).toISOString().split('T')[0];
    }
    
    // Пытаемся извлечь дату из ID (IIIIYYYYMMAAAAGGSS)
    // YYYY = index 4-7, MM = index 8-9
    if (id && id.length >= 10) {
      const year = id.substring(4, 8);
      const month = id.substring(8, 10);
      if (!isNaN(year) && !isNaN(month)) {
        return `${year}-${month}-01`;
      }
    }
    
    // Если ничего не вышло, берем дату изменения файла
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

const generateSitemap = () => {
  let entries = [];

  // Добавляем статические страницы
  staticRoutes.forEach(route => {
    entries.push({
      loc: `${SITE_URL}${route.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: route.priority
    });
  });

  // Добавляем статьи из MD файлов
  const articlesDir = path.join(contentBase, 'articles');
  if (fs.existsSync(articlesDir)) {
    fs.readdirSync(articlesDir).forEach(file => {
      if (file.endsWith('.md')) {
        const id = path.basename(file, '.md');
        const filePath = path.join(articlesDir, file);
        entries.push({
          loc: `${SITE_URL}/article/${id}`,
          lastmod: getFileDate(filePath, id),
          changefreq: 'monthly',
          priority: '0.8'
        });
      }
    });
  }

  // Добавляем авторов из MD файлов
  const authorsDir = path.join(contentBase, 'authors');
  if (fs.existsSync(authorsDir)) {
    fs.readdirSync(authorsDir).forEach(file => {
      if (file.endsWith('.md')) {
        const id = path.basename(file, '.md');
        const filePath = path.join(authorsDir, file);
        entries.push({
          loc: `${SITE_URL}/author/${id}`,
          lastmod: getFileDate(filePath, id),
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    });
  }

  // Добавляем выпуски из MD файлов
  const issuesDir = path.join(contentBase, 'issues');
  if (fs.existsSync(issuesDir)) {
    fs.readdirSync(issuesDir).forEach(file => {
      if (file.endsWith('.md')) {
        const id = path.basename(file, '.md');
        const filePath = path.join(issuesDir, file);
        entries.push({
          loc: `${SITE_URL}/issue/${id}`,
          lastmod: getFileDate(filePath, id),
          changefreq: 'monthly',
          priority: '0.7'
        });
      }
    });
  }

  // Генерируем XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(outputSitemap, sitemapXml);
  console.log(`Successfully generated sitemap.xml with ${entries.length} URLs.`);
};

generateSitemap();
