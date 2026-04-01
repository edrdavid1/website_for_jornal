import styles from './ArticleSection.module.css';
import VerticalLabel from '../../ui/VerticalLabel/VerticalLabel';
import ArticleCard from '../../common/ArticleCard';
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage';

export default function ArticleSection({ title, articles = [], imageSrc, reverse = false }) {
  // Статьи уже переведены, просто передаем в ArticleCard
  const processedArticles = (Array.isArray(articles) ? articles : [])
    .slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={reverse ? styles.gridReverse : styles.grid}>

        {/* Метка всегда вторая по логике десктопа, но первая в мобильной иерархии будет через CSS если нужно,
            но лучше переставить её в начало DOM для мобилок */}
        <div className={styles.verticalLabel}>
          <VerticalLabel text={title} />
        </div>

        <div className={styles.imageWrapper}>
          <OptimizedImage
            src={imageSrc}
            alt={title}
            className={styles.image}
          />
        </div>

       <div className={styles.articlesWrapper}>
          {processedArticles.map((article, index) => (
              <ArticleCard
                key={article.id || index}
                {...article}
              />
            ))}
        </div>

      </div>
    </section>
  );
}