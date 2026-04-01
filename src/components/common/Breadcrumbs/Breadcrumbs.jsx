// Breadcrumbs component
import { useNavigate, Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';
import { useTranslation } from '../../../context/LanguageContext';

const Breadcrumbs = ({ items }) => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();

  return (
    <nav className={styles.breadcrumbs}>
      <button onClick={() => navigate(-1)} className={styles.backArrow}>
        &larr;
      </button>
      
      {items.map((item, index) => (
        <span key={index} className={styles.itemWrapper}>
          {item.path ? (
            <Link to={item.path} className={styles.link}>
              {t(item.label)}
            </Link>
          ) : (
            <span className={styles.current}>{t(item.label)}</span>
          )}
          {index < items.length - 1 && <span className={styles.separator}>&mdash;</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;