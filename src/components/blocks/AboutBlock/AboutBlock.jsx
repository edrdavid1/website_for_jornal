import React from 'react';
import styles from './AboutBlock.module.css';

const AboutBlock = ({ image, label, text, isReverse = false }) => {
  // Если isReverse=true, применится класс с другим порядком колонок
  const containerClass = isReverse ? styles.gridReverse : styles.grid;

  return (
    <section className={containerClass}>
      {/* 1. Блок с картинкой */}
      <div className={styles.imageWrapper}>
        {typeof image === 'string' ? (
          <img src={image} alt={label} />
        ) : (
          image
        )}
      </div>

      {/* 2. Вертикальная метка (буквы друг под другом) */}
      <div className={styles.verticalLabel}>
        {label}
      </div>

      {/* 3. Текстовый контент */}
      <div className={styles.textContent}>
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </section>
  );
};

export default AboutBlock;