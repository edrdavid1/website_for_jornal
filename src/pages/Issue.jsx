import React from 'react';
import { useParams } from 'react-router-dom';
import NavMenu from '../components/ui/NavMenu/NavMenu';
import styles from './Issue.module.css';
import IssueHero from '../components/blocks/IssueHero/IssueHero';
import IssueArticlesList from '../components/blocks/IssueArticlesList/IssueArticlesList';
import SEO from '../components/common/SEO/SEO';
import { useIssues } from '../hooks/useIssues';
import { useTranslation } from '../context/LanguageContext';
import { currentIssue } from '../constants/currentIssue';

const Issue = () => {
  const { lang, t } = useTranslation();
  const { getIssueById } = useIssues();
  // Получаем id из URL, если нет параметра (для /current_issue), используем текущий выпуск
  const { id } = useParams();
  const issueId = id || String(currentIssue);
  const issue = getIssueById(issueId);

  return (
    <div className={styles.pageContainer}>
      {issue && (
        <SEO 
          title={`${t('issue') || 'Выпуск'} ${issue.title}`}
          description={issue.date}
          image={issue.cover}
        />
      )}
      <NavMenu /> 
      
      {/* Передаем id в Hero, чтобы там отобразилась обложка именно этого номера */}
      <IssueHero issueId={issueId} />
      
      <main>
        {/* Теперь id берется из параметров или текущего выпуска */}
        <IssueArticlesList issueId={issueId} />
      </main>
    </div>
  );
};

export default Issue;