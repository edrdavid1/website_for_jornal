import styles from './Skeleton.module.css';

/**
 * Универсальный компонент для скелетонов (Skeleton Screen).
 * @param {string} variant - 'text', 'rect', 'circle'
 * @param {string} width - Ширина (например, '100%', '200px')
 * @param {string} height - Высота (например, '1rem', '400px')
 * @param {string} className - Дополнительные CSS-классы
 * @param {object} style - Дополнительные инлайновые стили
 */
const Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '', 
  style = {} 
}) => {
  const skeletonClass = `${styles.skeleton} ${styles[variant]} ${className}`;
  
  const inlineStyle = {
    width: width || undefined,
    height: height || undefined,
    ...style
  };

  return <div className={skeletonClass} style={inlineStyle} aria-hidden="true" />;
};

export default Skeleton;
