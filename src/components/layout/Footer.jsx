import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { useTranslation } from '../../context/LanguageContext';
import OptimizedImage from '../../components/common/OptimizedImage/OptimizedImage';

const Footer = () => {
  const { t } = useTranslation();
  const placeholderImg = "https://placehold.co/1200x300?text=Footer+Image+Removed";

  return (
    <footer className={styles.footer}>
      <div className={styles.imageContainer}>
        <OptimizedImage
          src={placeholderImg}
          alt="Placeholder"
          className={styles.footerImg}
        />
      </div>
      
      <div className={styles.buttonsRow}>
        <Link to="/about" state={{ scrollTo: 'readers' }} className={styles.btn}>
          {t('support_us') || 'support us'}
        </Link>
        <Link to="/about" state={{ scrollTo: 'authors' }} className={styles.btn}>
          {t('for_authors') || 'for authors'}
        </Link>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.leftInfo}>
          © All rights reserved 2026 Journal
        </div>
        <div className={styles.centerInfo}>Vilnius</div>
      </div>
    </footer>
  );
};

export default Footer;