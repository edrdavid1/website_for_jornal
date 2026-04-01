import { useParams } from 'react-router-dom';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import CategoryMenu from '../components/common/CategoryMenu/CategoryMenu';
import { useArticles } from '../hooks/useArticles';
import { useTranslation } from '../context/LanguageContext';
import { usePagination } from '../hooks/usePagination';
import ArticleCard from '../components/common/ArticleCard';
import Pagination from '../components/ui/Pagination/Pagination';
import SEO from '../components/common/SEO/SEO';
import { useMemo } from 'react';
import styles from './Works.module.css';

const Works = () => {
  const { category = 'all' } = useParams();
  const { lang, t } = useTranslation();
  const { all } = useArticles();

  // Фильтруем и сортируем статьи по категории (новые первыми)
  const filteredArticles = useMemo(() => {
    const filtered = category === 'all' 
      ? all 
      : all.filter(article => article.category.toLowerCase() === category.toLowerCase());
    
    // Сортируем по ID в обратном порядке (новые первыми)
    return filtered.sort((a, b) => {
      // Сравниваем ID как числа для правильной сортировки
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);
      return idB - idA; // Обратный порядок
    });
  }, [all, category]);

  // Применяем пагинацию (20 статей на страницу)
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange
  } = usePagination(filteredArticles, 20);

  return (
    <div>
      <SEO 
        title={`${t('works')}${category !== 'all' ? `: ${t(category) || category}` : ''}`}
        description={t('works_description') || `${t('works')} Journal`}
      />
      <NavMenu />
      <CategoryMenu currentCategory={category} />
      
      <div className={styles.articlesGrid}>
        {currentItems.map((article) => (
          <ArticleCard 
            key={article.id}
            {...article} 
          />
        ))}
      </div>

      {/* Показываем пагинацию только если есть больше одной страницы */}
      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Works;