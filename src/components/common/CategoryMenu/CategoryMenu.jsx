import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../context/LanguageContext';
import styles from './CategoryMenu.module.css';

const CategoryMenu = ({ currentCategory }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isWorksPage = location.pathname.startsWith('/works');
  const basePath = isWorksPage ? '/works' : '/authors';

  const categories = isWorksPage 
    ? ['all', 'prose', 'essay', 'review', 'other'] 
    : ['writers', 'artists'];

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.categoryMenu} ref={dropdownRef}>
      {/* --- Mobile Dropdown Trigger --- */}
      <button className={styles.mobileTrigger} onClick={toggleDropdown}>
        <span>{t(currentCategory) || currentCategory}</span>
        <span className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ''}`}>▼</span>
      </button>

      {/* --- Categories List (Desktop and Mobile Dropdown) --- */}
      <div className={`${styles.categories} ${isDropdownOpen ? styles.dropdownOpen : ''}`}>
        {categories.map(cat => (
          <Link 
            key={cat}
            to={`${basePath}/${cat}`}
            className={`${styles.categoryLink} ${currentCategory === cat ? styles.active : ''}`}
            onClick={() => setIsDropdownOpen(false)}
          >
            {t(cat)}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
