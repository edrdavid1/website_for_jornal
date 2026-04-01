import { useState, useEffect, useRef } from 'react';
import styles from './OptimizedImage.module.css';

/**
 * OptimizedImage component with lazy loading, WebP support, and CLS prevention
 */
const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  eager = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Проверяем, не загрузилась ли картинка уже (актуально для кеша и пререндеринга)
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Сброс состояния при изменении src, но только если это не первая загрузка
    if (isLoaded && imgRef.current && imgRef.current.src !== src) {
      setIsLoaded(false);
      setError(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    // Если картинка уже была "загружена" (например, битая ссылка из кеша)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
      setError(true);
    } else {
      console.error('Image failed to load:', src, e);
      setError(true);
    }
    setIsLoaded(true);
  };

  // Обертка для стилей размеров
  const containerStyle = {
    width: width || '100%',
    aspectRatio: (width && height) ? `${width}/${height}` : undefined
  };

  if (error) {
    return (
      <div 
        className={`${styles.placeholder} ${className}`}
        style={containerStyle}
        role="img"
        aria-label={alt || 'Image'}
      >
        <span className={styles.placeholderText}>Image not available</span>
      </div>
    );
  }

  return (
    <div className={`${styles.imageWrapper} ${className}`} style={containerStyle}>
      {!isLoaded && <div className={styles.placeholder} />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async" // Изменяем на async для лучшей производительности
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
        sizes={sizes}
      />
    </div>
  );
};

export default OptimizedImage;
