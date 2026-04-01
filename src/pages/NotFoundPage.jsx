import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import SEO from '../components/common/SEO/SEO';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <SEO 
        title={`404 - ${t('page_not_found')}`}
        description={t('page_not_found_text')}
      />
      <NavMenu />
      <main className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>{t('page_not_found')}</p>
        <p className={styles.text}>{t('page_not_found_text')}</p>
        <Link to="/" className={styles.homeLink}>
          {t('home')}
        </Link>
      </main>
    </div>
  );
};

export default NotFoundPage;
