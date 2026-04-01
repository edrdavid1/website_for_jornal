// src/components/ui/ShareButton/ShareButton.jsx 
import { useState } from 'react' ; 
import styles from './ShareButton.module.css' ; 
import { useTranslation } from '../../../context/LanguageContext'; // Проверьте правильность пути 
 
export default function ShareButton({ title, url }) { 
  const  { t } = useTranslation(); 
  const [isCopied, setIsCopied] = useState(false ); 
 
  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
        // Последний рубеж: если clipboard API недоступен, пробуем старый execCommand
        try {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
          console.error('Final fallback failed:', e);
        }
      }
    };

    // Логика для мобильных устройств и поддерживающих браузеров
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (error) {
        // Если это не отмена пользователем, пробуем скопировать в буфер
        if (error.name !== 'AbortError') {
          console.log('Share failed, falling back to clipboard:', error);
          await copyToClipboard();
        }
      }
    } else {
      // Логика для десктопа или браузеров без Web Share API
      await copyToClipboard();
    }
  }; 
 
  return  ( 
    <button className={styles.shareButton} onClick={handleShare}> 
      {isCopied ? (t('link_copied') || 'Copied!') : (t('share') || 'Share')} 
      
      {isCopied ? ( 
        // Иконка успешного копирования (галочка) 
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"> 
          <polyline points="20 6 9 17 4 12"></polyline> 
        </svg> 
      ) : ( 
        // Стандартная иконка "поделиться" 
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"> 
          <circle cx="18" cy="5" r="3"></circle> 
          <circle cx="6" cy="12" r="3"></circle> 
          <circle cx="18" cy="19" r="3"></circle> 
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line> 
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line> 
        </svg> 
      )} 
    </button> 
  ); 
 } 
