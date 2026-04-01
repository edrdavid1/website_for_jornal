import styles from './Header.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { memo } from 'react';

const Languages = memo(({ currentLang, setLang }) => (
  <div className={styles.languages}>
    {['en', 'be', 'lt', 'ru'].map((lang) => (
      <button 
        key={lang}
        className={`${styles.langBtn} ${lang === currentLang ? styles.langBtnActive : ''}`}
        onClick={() => setLang(lang)}
      >
        {lang}
      </button>
    ))}
  </div>
));

const Logo = memo(() => (
  <div className={styles.logo}>
    <Link to="/" className={styles.logoText}>
      Journal
    </Link>
  </div>
));

const Header = () => {
  const { lang: currentLang, setLang } = useTranslation();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header className={styles.header}>
      {isHome ? (
        <>
          <Languages currentLang={currentLang} setLang={setLang} />
          <Logo />
        </>
      ) : (
        <>
          <Logo />
          <Languages currentLang={currentLang} setLang={setLang} />
        </>
      )}
    </header>
  );
};

export default Header;
