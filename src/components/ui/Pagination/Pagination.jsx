import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Создаем массив страниц (например, [1, 2, 3])
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginationContainer}>
      {/* Кнопка "Назад" */}
      <button 
        className={styles.arrow} 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Номера страниц */}
      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Кнопка "Вперед" */}
      <button 
        className={styles.arrow} 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;