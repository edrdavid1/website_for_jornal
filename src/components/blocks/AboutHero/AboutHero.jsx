import React from 'react';
import styles from './AboutHero.module.css';
import { useTranslation } from '../../../context/LanguageContext';

const HeroSection = ({ title, text, image }) => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.heroContainer}>
      <div className={styles.textContent}>
        <h1 className={styles.title}>{t('about')}</h1>
        <p className={styles.text} dangerouslySetInnerHTML={{ __html: text }} />
      </div>

      <div className={styles.imageWrapper}>
        {typeof image === 'string' ? (
          <img src={image} alt="Magazine preview" className={styles.image} />
        ) : (
          image
        )}
      </div>
    </div>
  );
};

export default HeroSection;