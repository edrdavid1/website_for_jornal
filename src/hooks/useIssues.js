import { useMemo, useCallback } from 'react';
import issuesData from '../data/issues-index.json';
import authorsData from '../data/authors-index.json';
import { currentIssue } from '../constants/currentIssue.js';

export const useIssues = () => {
  // Связываем выпуски с данными их авторов (художников)
  const allIssues = useMemo(() => {
    return issuesData.map((issue) => {
      // Ищем художника для текущего выпуска в общем индексе авторов
      const artistData = authorsData.find((author) => String(author.id) === String(issue.artist));
      
      return {
        ...issue,
        artistData: artistData || null,
      };
    });
  }, []);

  // Функция для получения конкретного выпуска
  const getIssueById = useCallback((id) => {
    return allIssues.find((issue) => String(issue.id) === String(id));
  }, [allIssues]);

  // Для страницы CurrentIssue нам нужен актуальный (например, с id = 1)

  return useMemo(() => ({
    allIssues,
    getIssueById,
    currentIssue,
  }), [allIssues, getIssueById]);
};
