import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Archive.module.css';
import { useIssues } from '../hooks/useIssues';
import { usePagination } from '../hooks/usePagination';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import Pagination from '../components/ui/Pagination/Pagination';
import SEO from '../components/common/SEO/SEO';
import { useTranslation } from '../context/LanguageContext';

import OptimizedImage from '../components/common/OptimizedImage/OptimizedImage';

const Archive = () => {
  const { t } = useTranslation();
  const { allIssues } = useIssues();
  
  // Сортировка от новых к старым
  const sortedIssues = [...allIssues].sort((a, b) => Number(b.id) - Number(a.id));

  // Изменили на 9 элементов на страницу, чтобы сетка 3х3 была всегда полной
  const ITEMS_PER_PAGE = 9;

  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange
  } = usePagination(sortedIssues, ITEMS_PER_PAGE);

  return (
    <div className={styles.pageContainer}>
      <SEO 
        title={t('archive')}
        description={t('archive_description') || `${t('archive')} Journal`}
      />
      <NavMenu /> 
      
      <main className={styles.content}>

        <div className={styles.grid}>
          {currentItems.map((issue) => (
            <Link to={`/issue/${issue.id}`} key={issue.id} className={styles.issueCard}>
              <div className={styles.imageWrapper}>
                 <OptimizedImage 
                    src={issue.cover} 
                    alt={`Issue ${issue.title}`} 
                    className={styles.coverImage} 
                 />
                 <div className={styles.overlay}>
                    <span>{t('view_issue') || 'Open'}</span>
                 </div>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.issueNumber}>{issue.title}</span>
                <span className={styles.viewLink}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Archive;