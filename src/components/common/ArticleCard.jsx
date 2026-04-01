import { Link } from 'react-router-dom';
import { memo } from 'react';
import styles from './ArticleCard.module.css';
import { useTranslation } from '../../context/LanguageContext';

const ArticleCard = memo(({ id, title, excerpt, category, date, author, author_id, rawCategory }) => {
  const { t } = useTranslation();
  
  // Функция для URL всегда должна быть на одной языке/ключе
  const slugify = (text) => {
    if (typeof text !== 'string') return '';
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  // Используем rawCategory, если он передан (оригинальный ключ для ссылок), иначе category
  const categoryForLink = rawCategory || category;

  return (
    <article className={styles.card} aria-labelledby={`article-title-${id}`}>
      <Link to={`/article/${id}`} className={styles.titleLink} aria-label={`${t('read_article')}: ${title}`}>
        <h4 id={`article-title-${id}`} className={styles.title}>{title}</h4>
      </Link>
      
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      
      <div className={styles.meta}>
        <Link 
          to={`/works/${slugify(categoryForLink)}`} 
          className={styles.metaLink}
          aria-label={`${t('category')}: ${t(category)}`}
        >
          {t(category)}
        </Link>
        
        <span className={styles.separator}>—</span> 
        <span className={styles.date}>{date}</span> 
        <span className={styles.separator}>—</span> 
        
        <span className={styles.by}>{t('by').toUpperCase()} </span>
        <Link 
          to={`/author/${author_id || slugify(author)}`} 
          className={styles.metaLink}
          aria-label={`${t('author')}: ${author}`}
        >
          {author}
        </Link>
      </div>
    </article>
  );
});

export default ArticleCard;