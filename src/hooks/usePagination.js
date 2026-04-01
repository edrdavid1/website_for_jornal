import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Рассчитываем общее количество страниц
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Получаем элементы для текущей страницы
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Функция для смены страницы
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Прокрутка наверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    setCurrentPage
  };
};
