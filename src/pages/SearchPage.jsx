import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useArticleSearch } from '../hooks/useArticleSearch';
import ArticleCard from '../components/common/ArticleCard';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import SEO from '../components/common/SEO/SEO';
import styles from './SearchPage.module.css';

const SearchPage = () => {
  const { t, lang } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { getResults } = useArticleSearch();

  // результаты поиска
  const results = useMemo(() => {
    if (!query) return [];
    return getResults(query);
  }, [query, getResults]);

  // поиск автора по всем переводам имени
  const matchedAuthorData = useMemo(() => {
    if (!query || results.length === 0) return null;

    const lowerQuery = query.toLowerCase();

    const found = results.find(article => {
      // ["Дэвид", "David", "Дэвід", "David"]
      const allNames = Object
        .values(article.author || {})
        .map(name => name.toLowerCase());

      return allNames.some(name => name.includes(lowerQuery));
    });

    if (found) {
      return {
        // имя на текущем языке сайта
        name: found.author?.[lang] || Object.values(found.author)[0],
        id: found.author_id
      };
    }

    return null;

  }, [results, query, lang]);

  return (
    <div className={styles.searchPage}>
      <SEO 
        title={`${t('search')}${query ? `: ${query}` : ''}`}
        description={`${t('search_results')} Journal`}
      />
      <NavMenu />

      {/* статусная строка */}
      <div className={styles.statusWrapper}>
        <div className={styles.statusContent}>
          <span>{t('search_results')}</span>
          <span className={styles.queryDisplay}>{query}</span>
        </div>
      </div>

      <div className={styles.resultsContent}>

        {/* кликабельный автор */}
        {matchedAuthorData && (
          <Link
            to={`/author/${matchedAuthorData.id}`}
            className={styles.authorLink}
          >
            <h1 className={styles.authorHeading}>
              {matchedAuthorData.name}
            </h1>
          </Link>
        )}

        {/* список статей */}
        <div className={styles.articlesList}>
          {results.length > 0 ? (
            results.map(article => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title[lang]}
                excerpt={article.excerpt?.[lang]}
                category={article.category}
                date={article.date}
                author={article.author[lang]}
                author_id={article.author_id}
              />
            ))
          ) : (
            <p className={styles.empty}>
              {t('nothing_found')}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchPage;