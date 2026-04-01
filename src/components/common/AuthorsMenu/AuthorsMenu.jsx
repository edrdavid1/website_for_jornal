import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './AuthorsMenu.module.css';
import { useTranslation } from '../../../context/LanguageContext';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const alphabets = {
  en: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
  ru: 'А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Э Ю Я',
  be: 'А Б В Г Д Е Ё Ж З І Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Ы Ў Я',
  lt: 'A Ą B C Č D E Ę Ė F G H I Į Y J K L M N O P R S Š T U Ų Ū V Z Ž',
};

const AuthorsMenu = ({ onLetterClick, visibleLetters = new Set(), forceCategory }) => {
  const { t, lang } = useTranslation();
  const { id, category } = useParams();

  // Приоритет: 1. Проп forceCategory, 2. Параметр category из URL, 3. Префикс artist- в ID
  const currentCategory = useMemo(() => {
    if (forceCategory) return forceCategory;
    if (category) return category === 'artists' ? 'artists' : 'writers';
    if (id && id.startsWith('artist-')) return 'artists';
    return 'writers';
  }, [forceCategory, category, id]);

  const isAuthorPage = !!id;

  const currentAlphabet = useMemo(() => {
    const str = alphabets[lang] || alphabets.en;
    return str.split(' ').filter((char) => char.trim() !== '');
  }, [lang]);

  const breadcrumbItems = [
    { label: 'authors', path: '/authors/writers' },
    { label: currentCategory, path: `/authors/${currentCategory}` },
    { label: 'profile' },
  ];

  return (
    <nav className={styles.categoryMenu}>
      <div className={styles.leftSide}>
        {isAuthorPage ? (
          <Breadcrumbs items={breadcrumbItems} />
        ) : (
          <div className={styles.alphabet}>
            <div className={styles.alphaGroup}>
              {currentAlphabet.map((char) => (
                <span
                  key={char}
                  className={`${styles.letter} ${visibleLetters.has(char) ? styles.visible : ''}`}
                  onClick={() => onLetterClick && onLetterClick(char)}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.categories}>
        {['artists', 'writers'].map((cat) => (
          <Link
            key={cat}
            to={`/authors/${cat}`}
            className={`${styles.categoryLink} ${currentCategory === cat ? styles.active : ''}`}
          >
            {t(cat)}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AuthorsMenu;

