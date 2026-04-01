import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../../context/LanguageContext';

/**
 * SEO компонент для управления мета-тегами.
 * @param {string} title - Заголовок страницы
 * @param {string} description - Описание (meta description)
 * @param {string} keywords - Ключевые слова (через запятую)
 * @param {string} image - URL изображения для Open Graph
 * @param {string} articleAuthor - Автор статьи (для мета-тегов)
 * @param {string} type - Тип контента (website, article и т.д.)
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  articleAuthor, 
  type = 'website' 
}) => {
  const { lang, t } = useTranslation();
  
  const siteName = t('site_name');
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = t('site_description');
  const currentDescription = description || defaultDescription;
  
  // Базовый URL для канонических ссылок
  const baseUrl = 'https://yourdomain.com';
  const path = window.location.pathname;
  const canonicalUrl = `${baseUrl}${path}`;

  useEffect(() => {
    // Сигнализируем Prerender.io, что страница готова к снимку
    // (через небольшую задержку, чтобы контент точно отрисовался)
    const timer = setTimeout(() => {
      window.prerenderReady = true;
    }, 500);

    return () => {
      window.prerenderReady = false;
      clearTimeout(timer);
    };
  }, [fullTitle, currentDescription]); // Перезапускаем при изменении контента

  return (
    <Helmet>
      {/* Основные теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={currentDescription} />
      {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <html lang={lang} />
      
      {/* Верификация поисковых систем */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={lang} />
      {image && (
        <>
          <meta property="og:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />
          <meta property="og:image:alt" content={title || siteName} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={currentDescription} />
      {image && <meta name="twitter:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />}

      {/* Для статей */}
      {type === 'article' && articleAuthor && (
        <meta name="author" content={articleAuthor} />
      )}
    </Helmet>
  );
};

export default SEO;
