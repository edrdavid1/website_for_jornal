import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './About.module.css';

// Импортируем компоненты
import NavMenu from '../components/ui/NavMenu/NavMenu';
import AboutHero from '../components/blocks/AboutHero/AboutHero';
import AboutBlock from '../components/blocks/AboutBlock/AboutBlock';
import OptimizedImage from '../components/common/OptimizedImage/OptimizedImage';
import { useTranslation } from '../context/LanguageContext';
import { aboutTranslations } from '../constants/translations';
import SEO from '../components/common/SEO/SEO';

const About = () => {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const readersRef = useRef(null);
  const authorsRef = useRef(null);

  const placeholderImg = "https://placehold.co/800x600?text=Image+Removed";

  const aboutText = aboutTranslations[lang]?.about || aboutTranslations.en.about;
  const readersText = aboutTranslations[lang]?.for_readers || aboutTranslations.en.for_readers;
  const authorsText = aboutTranslations[lang]?.for_authors || aboutTranslations.en.for_authors;

  useEffect(() => {
    if (location.state?.scrollTo === 'readers' && readersRef.current) {
      readersRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (location.state?.scrollTo === 'authors' && authorsRef.current) {
      authorsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className={styles.pageContainer}>
      <SEO
        title={t('about')}
        description={aboutText}
      />
      <NavMenu />

      <main className={styles.content}>
        {/* Верхний блок (Hero) тоже можно сделать через AboutBlock или отдельным стилем */}
        <AboutHero
          image={<OptimizedImage src={placeholderImg} alt="Placeholder" />}
          label="magazine"
          text={aboutText}
          isReverse={true}
        />

        {/* Секция "for readers" */}
        <div ref={readersRef}>
          <AboutBlock
            image={<OptimizedImage src={placeholderImg} alt="Placeholder" />}
            label={t('for_readers')}
            text={readersText}
            isReverse={false}
          />
        </div>

        {/* Секция "for authors" */}
        <div ref={authorsRef}>
          <AboutBlock
            image={<OptimizedImage src={placeholderImg} alt="Placeholder" />}
            label={t('for_authors')}
            text={authorsText}
            isReverse={true}
          />
        </div>
      </main>
    </div>
  );
};

export default About;