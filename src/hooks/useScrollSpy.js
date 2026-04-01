import { useState, useEffect, useRef } from 'react';

/**
 * Хук для отслеживания активного заголовка на основе IntersectionObserver.
 * @param {Array<string>} headingIds - Массив ID заголовков.
 * @returns {string} ID активного (видимого) заголовка.
 */
export const useScrollSpy = (headingIds) => {
  const [activeId, setActiveId] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    // Если нет заголовков, ничего не делаем
    if (!headingIds || headingIds.length === 0) return;

    // Настройки обсервера: срабатывает, когда заголовок пересекает верхнюю часть экрана
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80% 0px', // Отступ сверху для учета шапки
      threshold: 0.1,
    };

    const handleIntersect = (entries) => {
      // Находим последний элемент, который пересекает область видимости
      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        // Берем ID последнего элемента, который стал видимым
        const lastEntry = intersectingEntries[intersectingEntries.length - 1];
        setActiveId(lastEntry.target.id);
      }
    };

    observer.current = new IntersectionObserver(handleIntersect, observerOptions);

    // Находим все DOM-элементы заголовков по их ID и отдаем их обсерверу
    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.current.observe(element);
      }
    });

    // Очистка при размонтировании
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [headingIds]);

  return activeId;
};
