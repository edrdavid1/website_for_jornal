import { useMemo, useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useArticles } from '../../../hooks/useArticles';
import { useTranslation } from '../../../context/LanguageContext';
import styles from './IssueArticlesList.module.css';
import Skeleton from '../../common/Skeleton/Skeleton';

// Суб-компонент для отображения одной статьи с загрузкой полного текста
const ArticleListItem = memo(({ article, t, lang }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/content/articles/${article.id}.md`, { signal: controller.signal });
        if (response.ok) {
          const rawText = await response.text();
          const contentMatch = rawText.match(/^---[\s\S]*?---([\s\S]*)$/);
          if (contentMatch) {
            const body = contentMatch[1];
            const langPattern = new RegExp(`:::lang-${lang}([\\s\\S]*?):::`, 'i');
            const match = body.match(langPattern);
            let finalContent = match ? match[1].trim() : body.trim();

            // Удаляем заголовок H1 (# Заголовок) из начала текста, если он там есть
            // чтобы он не дублировался, так как заголовок уже выводится в <h2> выше
            finalContent = finalContent.replace(/^#\s+.*?\n+/, '');

            setContent(finalContent);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error loading article content:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadContent();

    return () => {
      controller.abort();
    };
  }, [article.id, lang]);

  return (
    <article key={article.id} className={styles.articleWrapper}>
      <header className={styles.header}>
        <Link to={`/article/${article.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{article.title}</h2>
        </Link>
        
        <div className={styles.authorMeta}>
          <span className={styles.byPrefix}>{t('by') || 'by'}</span>
          <Link to={`/author/${article.author_id}`} className={styles.authorLink}>
            {article.author}
          </Link>
        </div>
        
        <div className={styles.date}>
          <Link to={`/works/${article.category}`} className={styles.categoryLink}>
            {t(article.category) || article.category}
          </Link>
          {article.date && ` — ${article.date}`}
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.body}>
          {loading ? (
            <div className={styles.skeletonWrapper}>
              <Skeleton variant="text" width="100%" height="1.1rem" />
              <Skeleton variant="text" width="98%" height="1.1rem" />
              <Skeleton variant="text" width="95%" height="1.1rem" />
              <Skeleton variant="text" width="60%" height="1.1rem" />
            </div>
          ) : content ? (
            <div className={styles.markdownBody}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className={styles.paragraph}>{article.excerpt}</p>
          )}
        </div>
      </section>

      <div className={styles.listSeparator} />
    </article>
  );
});

export default function IssueArticlesList({ issueId }) {
  const { t, lang } = useTranslation();
  const { getArticlesByIssue } = useArticles();

  const issueArticles = useMemo(() => {
    const articles = getArticlesByIssue(issueId);
    return [...articles].sort((a, b) => (a.issue_order || 0) - (b.issue_order || 0));
  }, [getArticlesByIssue, issueId]);

  if (issueArticles.length === 0) return null;

  return (
    <div className={styles.container}>
      {issueArticles.map((article) => (
        <ArticleListItem 
          key={article.id} 
          article={article} 
          t={t} 
          lang={lang} 
        />
      ))}
    </div>
  );
}