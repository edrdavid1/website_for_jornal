// src/components/blocks/IssueHero/IssueHero.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './IssueHero.module.css';
import { useTranslation } from '../../../context/LanguageContext';
import { useIssues } from '../../../hooks/useIssues';
import { getLocalizedText } from '../../../components/utils/localization';
import ShareButton from '../../ui/ShareButton/ShareButton';
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage';
import Skeleton from '../../common/Skeleton/Skeleton';

export default function IssueHero({ issueId }) {
  const { t, lang } = useTranslation();
  const { getIssueById } = useIssues();
  
  // Получаем данные выпуска по переданному issueId
  const issue = getIssueById(issueId);
  const [issueDescription, setIssueDescription] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (issue) {
      const controller = new AbortController();
      const loadIssueContent = async () => {
        try {
          const response = await fetch(`/content/issues/${issue.id}.md`, { signal: controller.signal });
          if (response.ok) {
            const rawText = await response.text();
            const contentMatch = rawText.match(/^---[\s\S]*?---([\s\S]*)$/);
            if (contentMatch) {
              const content = contentMatch[1];
              const langPattern = new RegExp(`:::lang-${lang}([\\s\\S]*?):::`, 'i');
              const match = content.match(langPattern);
              setIssueDescription(match ? match[1].trim() : content.trim());
            }
          } else {
            setError(true);
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Error loading issue description:", error);
            setError(true);
          }
        }
      };
      loadIssueContent();

      return () => {
        controller.abort();
      };
    }
  }, [issue, lang]);

  if (!issue) return null;

  const { title, cover, artistData } = issue;

  return (
    <section className={styles.issueHero}>
      
      {/* Левая колонка с обложкой */}
      <div className={styles.leftCol}>
        <OptimizedImage 
          src={cover} 
          alt={`Cover of ${title}`} 
          className={styles.coverImage} 
        />
      </div>

      {/* Правая колонка с информацией */}
      <div className={styles.rightCol}>
        <div className={styles.issueNumberContainer}>
          <h1 className={styles.issueNumber}>№ {String(title).replace('№', '')}</h1>
        </div>

        <div className={styles.aboutSection}>
          <div className={styles.aboutText}>
            {error ? (
              <p className={styles.errorText}>{t('content_not_available') || 'Content not available'}</p>
            ) : (
              issueDescription || (
                <div className={styles.skeletonWrapper}>
                  <Skeleton variant="text" width="100%" height="1.2rem" />
                  <Skeleton variant="text" width="95%" height="1.2rem" />
                  <Skeleton variant="text" width="98%" height="1.2rem" />
                  <Skeleton variant="text" width="40%" height="1.2rem" />
                </div>
              )
            )}
          </div>
        </div>

        <div className={styles.artistSection}>
          <p className={styles.artistText}>
            {t('artist_of_cover') || 'Artist of cover'}{' '}
            {artistData && (
              <Link to={`/author/${artistData.id}`} className={styles.artistLink}>
                {getLocalizedText(artistData.name, lang)}
              </Link>
            )}
          </p>
          
          <ShareButton title={`${t('issue') || 'Issue'} ${title}`} />
        </div>
      </div>
      
    </section>
  );
}