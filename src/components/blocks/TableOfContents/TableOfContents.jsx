import React, { useState, useEffect } from 'react';
import styles from './TableOfContents.module.css';
import { useTranslation } from '../../../context/LanguageContext';

/**
 * Компонент Оглавления для статей.
 * @param {Array} items - Список заголовков { id, title, level }.
 * @param {string} activeId - ID текущего активного заголовка.
 */
const TableOfContents = React.memo(({ items, activeId }) => {
  const { t } = useTranslation();
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const top = window.scrollY < 100;
          setIsAtTop(top);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!items || items.length === 0) return null;

  const handleScrollToId = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Используем replaceState вместо pushState, чтобы не загрязнять историю переходов
      window.history.replaceState(null, null, `#${id}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Version */}
      <nav className={`${styles.tocContainer} ${isAtTop ? styles.visible : styles.hidden}`}>
        <div className={styles.tocWrapper}>
          <h4 className={styles.tocHeader}>{t('sections')}</h4>
          <ul className={styles.tocList}>
            {items.map((item) => (
              <li 
                key={item.id} 
                className={`${styles.tocItem} ${styles[`level${item.level}`]} ${activeId === item.id ? styles.active : ''}`}
              >
                <a 
                  href={`#${item.id}`} 
                  onClick={(e) => handleScrollToId(e, item.id)}
                  className={styles.tocLink}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile FAB Button */}
      <button 
        className={styles.mobileFab} 
        onClick={toggleMobileMenu}
        aria-label="Toggle Table of Contents"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="3" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Modal Overlay */}
      <div className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={toggleMobileMenu}>
        <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <h4>{t('sections')}</h4>
            <button className={styles.closeBtn} onClick={toggleMobileMenu}>&times;</button>
          </div>
          <ul className={styles.mobileList}>
            {items.map((item) => (
              <li 
                key={item.id} 
                className={`${styles.mobileItem} ${styles[`level${item.level}`]} ${activeId === item.id ? styles.active : ''}`}
              >
                <a 
                  href={`#${item.id}`} 
                  onClick={(e) => handleScrollToId(e, item.id)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
});

export default TableOfContents;
