import React, { useMemo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './AuthorsList.module.css';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import AuthorsMenu from '../components/common/AuthorsMenu/AuthorsMenu';
import { useTranslation } from '../context/LanguageContext';
import SEO from '../components/common/SEO/SEO';
import authorsData from '../data/authors-index.json';
import { getLocalizedText } from '../components/utils/localization';// Импортируем утилиту

export default function AuthorsList() {
  const { lang, t } = useTranslation();
  const { category } = useParams();
  const [visibleLetters, setVisibleLetters] = useState(new Set());
  
  const activeCategory = category === 'artists' ? 'artists' : 'writers';

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const offset = 120; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Группировка данных
  const groupedData = useMemo(() => {
    // В MD системе художники и писатели могут быть разделены по ID или просто фильтроваться
    // Для примера считаем, что все авторы в authors-index.json
    const targetData = authorsData; 
    if (!targetData) return {};

    const groups = {};
    
    targetData.forEach(item => {
      // Простая фильтрация по категории, если она есть в метаданных MD
      if (activeCategory === 'writers' && item.isArtist) return;
      if (activeCategory === 'artists' && !item.isArtist) return;

      const name = getLocalizedText(item.name, lang);
      if (!name) return;
      
      const firstLetter = name.charAt(0).toUpperCase();
      
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(item);
    });

    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
  }, [lang, activeCategory]);

  // ИСПРАВЛЕНО: Оптимизированное отслеживание видимости секций через IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      // Настраиваем отступы срабатывания (примерно соответствуют твоим 120px и 150px)
      rootMargin: '-120px 0px -150px 0px', 
      threshold: 0.1 // Срабатывает, когда видно хотя бы 10% секции
    };

    const observer = new IntersectionObserver((entries) => {
      setVisibleLetters((prevVisible) => {
        const newVisible = new Set(prevVisible);
        
        entries.forEach((entry) => {
          const letter = entry.target.getAttribute('data-letter');
          if (entry.isIntersecting) {
            newVisible.add(letter);
          } else {
            newVisible.delete(letter);
          }
        });
        
        return newVisible;
      });
    }, observerOptions);

    const letterElements = document.querySelectorAll('[data-letter]');
    letterElements.forEach(element => observer.observe(element));

    // ВАЖНО: Очистка при размонтировании
    return () => {
      letterElements.forEach(element => observer.unobserve(element));
      observer.disconnect();
    };
  }, [groupedData]); // Перезапускаем обзервер, если изменился список секций

  return (
    <div className={styles.pageContainer}>
      <SEO 
        title={t(activeCategory) || activeCategory}
        description={t('authors_description') || `${t(activeCategory)} Journal`}
      />
      <NavMenu /> 
      
      <AuthorsMenu 
        onLetterClick={scrollToLetter} 
        visibleLetters={visibleLetters} 
      />
      
      <main className={styles.content}>
        {Object.entries(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([letter, items]) => (
            <section 
              key={letter} 
              id={`letter-${letter}`} 
              className={styles.letterSection}
              data-letter={letter}
            >
              <h2 className={styles.letterHeading}>{letter}</h2>
              
              <div className={styles.namesList}>
                {items.map(item => (
                  <Link 
                    key={item.id} 
                    to={`/author/${activeCategory === 'artists' ? `artist-${item.id}` : item.id}`} 
                    className={styles.authorItem}
                  >
                    {getLocalizedText(item.name, lang)}
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={styles.emptyState}>
            {/* Используем контекст перевода вместо хардкода */}
            {t('list_is_empty', 'Список пуст')} 
          </div>
        )}
      </main>
    </div>
  );
}