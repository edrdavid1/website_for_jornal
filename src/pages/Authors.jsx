import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import yaml from 'js-yaml';
import { useArticles } from '../hooks/useArticles';
import { useIssues } from '../hooks/useIssues';
import { useTranslation } from '../context/LanguageContext';
import authorsData from '../data/authors-index.json';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import AuthorsMenu from '../components/common/AuthorsMenu/AuthorsMenu';
import ArticleCard from '../components/common/ArticleCard';
import { getLocalizedText } from '../components/utils/localization';
import SEO from '../components/common/SEO/SEO';
import OptimizedImage from '../components/common/OptimizedImage/OptimizedImage';
import styles from './Authors.module.css';
import ShareButton from '../components/ui/ShareButton/ShareButton';
import Skeleton from '../components/common/Skeleton/Skeleton';

const AuthorPage = () => {
  const { id } = useParams();
  const { lang, t } = useTranslation(); 
  const { getArticlesByIds } = useArticles();
  const { getIssueById } = useIssues();
  const [bioContent, setBioContent] = useState('');
  const [authorWorksIds, setAuthorWorksIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    
    // Загрузка био и метаданных из MD файла
    const loadAuthorData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/content/authors/${id}.md`, { signal: controller.signal });
        if (response.ok) {
          const rawText = await response.text();
          
          // Извлекаем Frontmatter (метаданные)
          const frontmatterMatch = rawText.match(/^---([\s\S]*?)---/);
          if (frontmatterMatch) {
            try {
              const yamlContent = yaml.load(frontmatterMatch[1]);
              if (yamlContent.works_ids) {
                setAuthorWorksIds(yamlContent.works_ids);
              }
            } catch (e) {
              console.error("Error parsing author YAML:", e);
            }
          }

          const contentMatch = rawText.match(/^---[\s\S]*?---([\s\S]*)$/);
          if (contentMatch) {
            const content = contentMatch[1];
            const langPattern = new RegExp(`:::lang-${lang}([\\s\\S]*?):::`, 'i');
            const match = content.match(langPattern);
            setBioContent(match ? match[1].trim() : content.trim());
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error loading author data:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadAuthorData();

    return () => {
      controller.abort();
    };
  }, [id, lang]);

  const { author, isWriter } = useMemo(() => {
    // Если ID начинается с "artist-", убираем этот префикс для поиска в базе
    const cleanId = id.startsWith('artist-') ? id.replace('artist-', '') : id;
    const foundAuthor = authorsData.find(a => String(a.id) === String(cleanId));
    
    // Если нашли автора в JSON, мержим его с данными из MD (works_ids)
    const mergedAuthor = foundAuthor ? {
      ...foundAuthor,
      works_ids: authorWorksIds.length > 0 ? authorWorksIds : foundAuthor.works_ids
    } : null;

    return { 
      author: mergedAuthor, 
      isWriter: mergedAuthor ? !mergedAuthor.isArtist : true 
    };
  }, [id, authorWorksIds]);

  const { works, artworks } = useMemo(() => {
    if (!author) return { works: [], artworks: [] };
    
    // Разделяем works_ids на статьи и обложки выпусков
    const articleIds = [];
    const issueCoverIds = [];
    
    (author.works_ids || []).forEach(workId => {
      if (typeof workId === 'string' && workId.startsWith('issue_cover_')) {
        const issueId = workId.replace('issue_cover_', '');
        issueCoverIds.push(issueId);
      } else {
        articleIds.push(workId);
      }
    });
    
    // Получаем статьи
    const articles = getArticlesByIds(articleIds);
    
    // Получаем обложки выпусков
    const issueCovers = issueCoverIds.map(issueId => {
      const issue = getIssueById(issueId);
      return issue ? {
        id: `issue_cover_${issueId}`,
        title: `${t('issue')} ${issue.title}`,
        image: issue.cover,
        date: issue.date,
        isIssueCover: true
      } : null;
    }).filter(Boolean);
    
    // Обрабатываем статьи
    const processedArticles = articles.map(article => ({
      ...article,
      title: getLocalizedText(article.title, lang),
      excerpt: getLocalizedText(article.excerpt, lang),
      authorName: getLocalizedText(author.name, lang),
      rawCategory: typeof article.category === 'string' ? article.category : 'default',
      image: article.cover || article.image
    }));

    // Для художников: artworks = обложки выпусков + статьи с изображениями, works = пустые
    // Для писателей: works = все статьи, artworks = пустые
    if (author.isArtist) {
      const artworksFromArticles = processedArticles.filter(w => w.image);
      return {
        artworks: [...issueCovers, ...artworksFromArticles], // Обложки + статьи с изображениями
        works: [] // Художники не показывают статьи без изображений
      };
    } else {
      return {
        artworks: [], // Писатели не показывают картины
        works: processedArticles // Все статьи писателя
      };
    }
  }, [author, getArticlesByIds, getIssueById, lang, t]); 

  if (!author) return <div className={styles.error}>{t('author_not_found')}</div>;

  return (
    <div className={styles.pageContainer}>
      <SEO 
        title={getLocalizedText(author.name, lang)}
        description={bioContent || getLocalizedText(author.name, lang)}
        image={artworks.length > 0 ? artworks[0].image : undefined}
        type="profile"
      />
      <NavMenu />
      <AuthorsMenu forceCategory={isWriter ? 'writers' : 'artists'} />

      <main className={styles.mainGrid}>
        <aside className={styles.leftCol}>
          <div className={styles.stickyContent}>
            <h1 className={styles.authorName}>
              {getLocalizedText(author.name, lang)}
            </h1>
            <div className={styles.bio}>
              {loading ? (
                <div className={styles.skeletonWrapper}>
                  <Skeleton variant="text" width="100%" height="1.1rem" />
                  <Skeleton variant="text" width="95%" height="1.1rem" />
                  <Skeleton variant="text" width="98%" height="1.1rem" />
                  <Skeleton variant="text" width="40%" height="1.1rem" />
                </div>
              ) : (
                bioContent
              )}
            </div>
            <ShareButton title={getLocalizedText(author.name, lang)} />
          </div>
        </aside>

        <div className={styles.midCol}>
          <div className={styles.verticalLabel}>
            {t('works')}
          </div>
        </div>

        <section className={styles.rightCol}>
          {/* Для художников показываем только КАРТИНЫ */}
          {author.isArtist && artworks.length > 0 && (
            <div className={styles.contentSection}>
              <div className={styles.artGrid}>
                {artworks.map(art => (
                  <Link
                    to={art.isIssueCover ? `/issue/${art.id.replace('issue_cover_', '')}` : `/article/${art.id}`}
                    key={art.id}
                    className={styles.artItem}
                  >
                    <OptimizedImage
                      src={art.image}
                      alt={art.title}
                      className={styles.artImage}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Для писателей показываем только СТАТЬИ */}
          {!author.isArtist && works.length > 0 && (
            <div className={styles.contentSection}>
              <div className={styles.articlesStack}>
                {works.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    {...article} 
                    author={article.authorName}
                    title={article.title}
                    excerpt={article.excerpt}
                    rawCategory={article.rawCategory}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Если нет работ */}
          {(author.isArtist && artworks.length === 0) || (!author.isArtist && works.length === 0) ? (
            <p className={styles.empty}>{author.isArtist ? t('no_artworks') : t('no_articles')}</p>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default AuthorPage;