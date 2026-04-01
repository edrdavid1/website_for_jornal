import GithubSlugger from 'github-slugger';

/**
 * Извлекает заголовки (h2 и h3) из текста Markdown для создания оглавления.
 * @param {string} markdownText - Текст в формате Markdown.
 * @returns {Array} Массив объектов заголовков { id, title, level }.
 */
export const extractHeadings = (markdownText) => {
  if (!markdownText) return [];
  
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdownText)) !== null) {
    const level = match[1].length; // 2 или 3 (## или ###)
    const text = match[2].replace(/[#*`_]/g, '').trim(); // Очистка от Markdown-символов
    const id = slugger.slug(text); // Генерация ID, совместимого с rehype-slug
    
    headings.push({ id, title: text, level });
  }
  
  return headings;
};
