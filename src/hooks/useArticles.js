import { useMemo, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import articlesData from '../data/search-index.json';

/**
 * Парсинг ID формата: IIIIYYYYMMAAAAGGSS
 */
const parseArticleId = (id) => {
  const str = String(id);
  // Проверяем ID (18 символов для обычного, 20 для расширенного)
  if (str.length !== 18 && str.length !== 20) return null;
  
  return {
    issue: parseInt(str.substring(0, 4), 10),
    year: parseInt(str.substring(4, 8), 10),
    month: parseInt(str.substring(8, 10), 10),
    authorId: str.substring(10, 14),
    genreId: str.substring(14, 16),
    order: parseInt(str.substring(16, 18), 10)
  };
};

const genreMapping = {
  '01': 'prose',
  '02': 'essay', 
  '03': 'review',
  '04': 'poetry',
  '05': 'other'
};

const monthNames = [
  '', 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getCategoryKey = (category) => {
  const normalized = category?.toLowerCase().trim();
  const validCategories = ['prose', 'essay', 'review', 'poetry'];
  if (validCategories.includes(normalized)) return normalized;
  if (normalized === 'novelette' || normalized === 'short story') return 'prose';
  return 'other';
};

export const useArticles = () => {
  const { lang } = useTranslation();

  const translate = useCallback((field, targetLang) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[targetLang] || field['en'] || Object.values(field)[0] || '';
  }, []);

  const all = useMemo(() => {
    // Теперь берем данные из сгенерированного JSON индекса (сформированного из MD)
    const sourceArticles = articlesData;

    return sourceArticles
      .filter(article => !article.isArtOnly) // Скрываем картины из общих списков (Latest, Popular, Search)
      .map(article => {
      const parsedId = parseArticleId(article.id);
      
      const genreKey = parsedId 
        ? (genreMapping[parsedId.genreId] || 'other') 
        : getCategoryKey(article.category);

      const derivedDate = parsedId 
        ? `${monthNames[parsedId.month]} ${parsedId.year}` 
        : article.date;
      
      // Приоритет отдаем значению issue из JSON (из MD frontmatter), 
      // если оно равно '0', значит статья вне выпусков.
      const issueValue = (article.issue === '0' || article.issue === 0) 
        ? 0 
        : (parsedId ? parsedId.issue : article.issue);
      
      return {
        ...article,
        issue: issueValue,
        issue_order: parsedId ? parsedId.order : article.issue_order,
        author_id: parsedId ? parsedId.authorId : article.author_id,
        date: derivedDate,
        category: genreKey,
        
        // Локализация происходит здесь в зависимости от lang из контекста
        title: translate(article.title, lang),
        excerpt: translate(article.excerpt, lang),
        author: translate(article.author, lang),
        // Контент (полный текст) в списке не нужен, он грузится отдельно в ArticleDetail
        content: null 
      };
    });
  }, [lang, translate]); // Пересчитываем массив при смене языка

  const getArticlesByIds = useCallback((ids) => {
    if (!ids || !Array.isArray(ids)) return [];
    const stringIds = ids.map(id => String(id));
    
    // Для получения по конкретным ID используем исходный массив articlesData,
    // чтобы игнорировать фильтр isArtOnly
    return articlesData
      .filter(article => stringIds.includes(String(article.id)))
      .map(article => {
        const parsedId = parseArticleId(article.id);
        const genreKey = parsedId 
          ? (genreMapping[parsedId.genreId] || 'other') 
          : getCategoryKey(article.category);

        const derivedDate = parsedId 
          ? `${monthNames[parsedId.month]} ${parsedId.year}` 
          : article.date;
        
        const issueValue = (article.issue === '0' || article.issue === 0) 
          ? 0 
          : (parsedId ? parsedId.issue : article.issue);
        
        return {
          ...article,
          issue: issueValue,
          issue_order: parsedId ? parsedId.order : article.issue_order,
          author_id: parsedId ? parsedId.authorId : article.author_id,
          date: derivedDate,
          category: genreKey,
          title: translate(article.title, lang),
          excerpt: translate(article.excerpt, lang),
          author: translate(article.author, lang),
          content: null 
        };
      });
  }, [lang, translate]);

  const getArticlesByIssue = useCallback((issueId) => {
    return all.filter(a => String(a.issue) === String(issueId));
  }, [all]);

  const getArticleById = useCallback((id) => {
    return all.find(a => String(a.id) === String(id));
  }, [all]);

  const getAuthorSlug = useCallback((name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }, []);

  return useMemo(() => ({ 
    all, 
    getArticlesByIssue, 
    getArticleById, 
    getArticlesByIds, 
    getAuthorSlug 
  }), [all, getArticlesByIssue, getArticleById, getArticlesByIds, getAuthorSlug]);
};
