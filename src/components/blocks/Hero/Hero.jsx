import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useArticles } from '../../../hooks/useArticles';
import styles from './Hero.module.css';
import { useTranslation } from '../../../context/LanguageContext';
import { currentIssue } from '../../../constants/currentIssue';
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage';

export default function Hero() {
  const { t } = useTranslation();
  const { all } = useArticles();

  // Получаем статьи текущего выпуска и берем первые 3
  const currentIssueArticles = useMemo(
    () => all.filter((article) => String(article.issue) === String(currentIssue)).slice(0, 3),
    [all]
  );

  return (
    <section className={styles.hero}>
      <div className={styles.leftCol}>
        <div className={styles.articlesList}>
          {currentIssueArticles.map((article) => (
            /* Теперь это обычный div, а не Link */
            <div key={article.id} className={styles.heroArticle}>
              
              {/* Ссылка на статью только для заголовка */}
              <Link to={`/article/${article.id}`} className={styles.titleLink}>
                <h3 className={styles.heroArticleTitle}>{article.title}</h3>
              </Link>

              {/* Ссылка на автора */}
              <p className={styles.heroArticleAuthor}>
                {t('by')}{' '}
                <Link 
                  to={`/author/${article.author_id}`} 
                  className={styles.authorLink}
                >
                  {article.author}
                </Link>
              </p>
            </div>
          ))}
          
          {currentIssueArticles.length === 0 && (
            <div className={styles.heroArticle}>
              <h3>{t('no_articles')}</h3>
            </div>
          )}
        </div>

        <Link to="/current_issue" className={styles.issueLink}>
          <h2 className={styles.issueTitle}>
            {t('issue')} <span className={styles.issueNumber}>№{currentIssue}</span>
          </h2>
        </Link>
      </div>

      <div className={styles.rightCol}>
        <OptimizedImage
          src="https://placehold.co/800x1200?text=Hero+Art+Removed"
          alt="Placeholder Art"
          eager={true}
          className={styles.mainImage}
        />
      </div>
    </section>
  );
}