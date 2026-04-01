import { useState, memo, useCallback, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../context/LanguageContext';
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs';
import styles from './NavMenu.module.css';

const NavMenu = memo(({ breadcrumbItems }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tempQuery, setTempQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Жесткая блокировка скролла
  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, []);

  const handleExecuteSearch = useCallback(() => {
    const trimmedQuery = tempQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setTempQuery('');
      closeMenu();
    }
  }, [tempQuery, navigate, closeMenu]);

  const getLinkClass = useCallback((path) => {
    const isAuthorRelated = path === '/authors' && location.pathname.startsWith('/author');
    const isActive = location.pathname === path || isAuthorRelated;
    return `${styles.link} ${isActive ? styles.activeLink : ''}`;
  }, [location.pathname]);

  return (
    <nav className={`${styles.nav} ${isHome ? styles.navHome : styles.navInner} ${isMenuOpen ? styles.navOpen : ''}`}>
      {breadcrumbItems && (
        <div className={styles.breadcrumbsWrapper}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      )}

      <div className={styles.navContent}>
        {/* Десктопный поиск (скрыт на мобилках через CSS) */}
        {isSearchOpen && (
          <div className={styles.searchOverlay}>
            <input
              type="text"
              className={isHome ? styles.searchInputHome : styles.searchInput}
              placeholder={`${t('search')}...`}
              value={tempQuery}
              onChange={(e) => setTempQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch()}
              autoFocus
            />
            <div className={styles.searchActions}>
              <button className={styles.executeSearchBtn} onClick={handleExecuteSearch} disabled={!tempQuery.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              <button className={styles.closeBtn} onClick={() => setIsSearchOpen(false)}>&times;</button>
            </div>
          </div>
        )}

        <button 
          className={`${styles.burgerBtn} ${isMenuOpen ? styles.burgerBtnOpen : ''}`} 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={t('sections')}
          aria-controls="navigation-list"
        >
          <span className={styles.burgerLabel}>{t('sections')}</span>
          <span className={`${styles.burgerArrow} ${isMenuOpen ? styles.arrowUp : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>

        <ul 
          id="navigation-list"
          className={`${styles.list} ${isMenuOpen ? styles.listOpen : ''}`}
        >
          {isMenuOpen && (
            <button className={styles.closeMenuBtn} onClick={closeMenu}>
              <span className={styles.closeIcon}>&times;</span>
            </button>
          )}

          <li className={styles.mobileOnlySearch}>
            <div className={styles.mobileSearchInline}>
              <input
                type="text"
                value={tempQuery}
                onChange={(e) => setTempQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch()}
                placeholder={`${t('search')}...`}
                className={styles.mobileSearchInput}
              />
              <button onClick={handleExecuteSearch} disabled={!tempQuery.trim()} className={styles.executeSearchBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </div>
          </li>

          <div className={`${styles.navLinks} ${isSearchOpen ? styles.listHidden : ''}`}>
            {/* Кнопка теперь рендерится всегда, управление видимостью — в CSS */}
            {!breadcrumbItems && (
              <li className={styles.currentIssueLink}>
                <NavLink to="/current_issue" className={getLinkClass('/current_issue')} onClick={closeMenu}>
                  {t('current_issue')}
                </NavLink>
              </li>
            )}

            {!breadcrumbItems && (
              <>
                <li><NavLink to="/works" className={getLinkClass('/works')} onClick={closeMenu}>{t('works')}</NavLink></li>
                <li><NavLink to="/authors" className={getLinkClass('/authors')} onClick={closeMenu}>{t('authors')}</NavLink></li>
                <li><NavLink to="/archive" className={getLinkClass('/archive')} onClick={closeMenu}>{t('archive')}</NavLink></li>
                <li><NavLink to="/about" className={getLinkClass('/about')} onClick={closeMenu}>{t('about')}</NavLink></li>
              </>
            )}
          </div>

          <li className={styles.desktopOnlySearch}>
            {!isSearchOpen && (
              <button className={styles.searchBtn} onClick={() => setIsSearchOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
});

export default NavMenu;