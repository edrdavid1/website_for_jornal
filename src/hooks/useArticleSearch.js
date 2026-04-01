import { useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import articlesData from '../data/search-index.json';

export const useArticleSearch = () => {
  const fuse = useMemo(() => {
    const options = {
      threshold: 0.3, // Уровень гибкости (0.0 - точное совпадение, 1.0 - найдет что угодно)
      ignoreLocation: true, // Искать в любом месте строки
      includeScore: true,
      minMatchCharLength: 1, // Начинать поиск с 1 символа
      keys: [
        // Поиск по всем языковым полям одновременно
        "title.en", "title.be", "title.lt", "title.ru",
        "author.en", "author.be", "author.lt", "author.ru",
        "keywords.en", "keywords.be", "keywords.lt", "keywords.ru",
        "excerpt.en", "excerpt.be", "excerpt.lt", "excerpt.ru"
      ]
    };
    return new Fuse(articlesData, options);
  }, []); // Пустой массив, чтобы индекс не перестраивался зря

  const getResults = useCallback((query) => {
    if (!query || query.trim().length < 1) return [];
    return fuse.search(query).map(result => result.item);
  }, [fuse]);

  return { getResults };
};
