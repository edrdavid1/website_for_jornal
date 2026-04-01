import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import yaml from 'js-yaml';
import { useArticles } from '../hooks/useArticles';
import styles from './ArticleDetail.module.css';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import Breadcrumbs from '../components/common/Breadcrumbs/Breadcrumbs';
import { useTranslation } from '../context/LanguageContext';
import SEO from '../components/common/SEO/SEO';
import ShareButton from '../components/ui/ShareButton/ShareButton';
import TableOfContents from '../components/blocks/TableOfContents/TableOfContents';
import { extractHeadings } from '../utils/extractHeadings';
import { useScrollSpy } from '../hooks/useScrollSpy';
import Skeleton from '../components/common/Skeleton/Skeleton';

const ArticleDetail = () => {
  const { id } = useParams();
  const { getArticleById } = useArticles();
  const { lang } = useTranslation();

  const article = getArticleById(id);
  const [markdownContent, setMarkdownContent] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const controller = new AbortController();
    const loadMarkdown = async () => {
      try {
        // Загружаем один MD файл для всех языков из папки public/content/articles
        const response = await fetch(`/content/articles/${id}.md`, { signal: controller.signal });
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Article not found');
          } else {
            setError('Failed to load article');
          }
          setLoading(false);
          setMarkdownContent(null);
          setMetadata(null);
          return;
        }
        
        const rawText = await response.text();

        // Парсим Frontmatter вручную через js-yaml
        const frontmatterMatch = rawText.match(/^---([\s\S]*?)---([\s\S]*)$/);

        if (frontmatterMatch) {
          const data = yaml.load(frontmatterMatch[1]);
          const content = frontmatterMatch[2];
          setMetadata(data);

          // Извлекаем контент для текущего языка по меткам :::lang-XX
          const langPattern = new RegExp(`:::lang-${lang}([\\s\\S]*?):::`, 'i');
          const match = content.match(langPattern);
          let finalContent = match ? match[1].trim() : content.trim();

          // Удаляем заголовок H1 (# Заголовок) из начала текста, если он там есть
          finalContent = finalContent.replace(/^#\s+.*?\n+/, '');

          setMarkdownContent(finalContent);
        } else {
          setMarkdownContent(rawText.trim());
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error loading markdown:", err);
          setError('Failed to load article');
        }
      } finally {
        setLoading(false);
      }
    };
    loadMarkdown();

    return () => {
      controller.abort();
    };
  }, [id, lang]);

  // Извлекаем заголовки для оглавления
  const tocItems = useMemo(() => extractHeadings(markdownContent), [markdownContent]);
  const headingIds = useMemo(() => tocItems.map(item => item.id), [tocItems]);
  const activeId = useScrollSpy(headingIds);

  // Используем метаданные из MD если они есть, иначе из старого articles.js
  const currentArticle = metadata ? {
    ...metadata,
    title: metadata.title?.[lang] || metadata.title?.en || '',
    author: metadata.author?.[lang] || metadata.author?.en || '',
  } : article;

  // Показываем ошибку 404 если статья не найдена
  if (!currentArticle || error === 'Article not found') {
    return (
      <>
        <NavMenu />
        <main className={styles.container}>
          <div className={styles.notFound}>
            <h1>Article Not Found</h1>
            <p>The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link to="/works" className={styles.backLink}>← Back to Works</Link>
          </div>
        </main>
      </>
    );
  }

  // Показываем состояние загрузки
  if (loading) {
    return (
      <>
        <NavMenu />
        <main className={styles.container}>
          <div className={styles.articleWrapper}>
            <header className={styles.header}>
              <Skeleton variant="text" width="80%" height="3.5rem" style={{ marginBottom: '1.5rem' }} />
              <Skeleton variant="text" width="40%" height="1.5rem" />
              <Skeleton variant="text" width="20%" height="1rem" style={{ marginTop: '0.5rem' }} />
            </header>
            <section className={styles.content}>
              <Skeleton variant="text" width="100%" height="1.2rem" />
              <Skeleton variant="text" width="95%" height="1.2rem" />
              <Skeleton variant="text" width="98%" height="1.2rem" />
              <Skeleton variant="text" width="60%" height="1.2rem" style={{ marginBottom: '2rem' }} />
              
              <Skeleton variant="text" width="100%" height="1.2rem" />
              <Skeleton variant="text" width="92%" height="1.2rem" />
              <Skeleton variant="text" width="97%" height="1.2rem" />
              <Skeleton variant="text" width="100%" height="1.2rem" />
              <Skeleton variant="text" width="40%" height="1.2rem" />
            </section>
          </div>
        </main>
      </>
    );
  }

  // Показываем ошибку если произошла ошибка загрузки
  if (error) {
    return (
      <>
        <NavMenu />
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Error</h1>
            <p>{error}</p>
            <Link to="/works" className={styles.backLink}>← Back to Works</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={currentArticle.title} 
        description={currentArticle.excerpt}
        keywords={currentArticle.keywords?.[lang] || currentArticle.keywords?.en}
        image={currentArticle.cover || currentArticle.image}
        articleAuthor={currentArticle.author}
        type="article"
      />
      <NavMenu />
      <Breadcrumbs 
        items={[
          { path: "/works", label: "Works" },
          { path: `/author/${currentArticle.author_id}`, label: currentArticle.author },
          { label: currentArticle.title }
        ]}
      />
      <main className={styles.container}>
        {/* Оглавление теперь фиксированное, выносим из общего потока */}
        <TableOfContents items={tocItems} activeId={activeId} />

        <div className={styles.articleWrapper}>
          {/* Шапка статьи */}
          <header className={styles.header}>
            <h1 className={styles.title}>{currentArticle.title}</h1>
            <Link to={`/author/${currentArticle.author_id}`} className={styles.authorLink}>
              {currentArticle.author}
            </Link>
            <p className={styles.date}>{currentArticle.date || 'MAY 2026'}</p>
          </header>

          {/* Контент статьи */}
          <section className={styles.content}>
            <div className={styles.body}>
              {markdownContent ? (
                <div className={styles.markdownBody}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug]}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              ) : (
                /* Фолбэк на старый формат из JS если MD не загрузился */
                article && Array.isArray(article.content) ? (
                  article.content.map((p, i) => <p key={i} className={styles.paragraph}>{p}</p>)
                ) : (
                  <p className={styles.paragraph}>{article?.excerpt || ''}</p>
                )
              )}
            </div>
          </section>

          {/* Кнопка Share */}
          <footer className={styles.footer}>
            <ShareButton title={currentArticle.title} />
          </footer>
        </div>
      </main>
    </>
  );
};

export default ArticleDetail;