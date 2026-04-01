import { useArticles } from "../hooks/useArticles";
import ArticleSection from "../components/blocks/ArticleSection/ArticleSection";
import Hero from "../components/blocks/Hero/Hero";
import NavMenu from "../components/ui/NavMenu/NavMenu";
import styles from "../styles/Home.module.css"; 
import { useTranslation } from '../context/LanguageContext';
import SEO from '../components/common/SEO/SEO';


const Home = () => {
  const { t } = useTranslation();
  const { all } = useArticles();
  
  // Фильтруем статьи для нужных секций (статьи уже переведены!)
  const latest = all.filter(article => article.isLatest).slice(0, 3);
  const popular = all.filter(article => article.isPopular).slice(0, 3);

  return (
    <main className={styles.container}>
      <SEO 
        title={t('home') || 'Главная'} 
        description={t('home_description') || 'Literary and art magazine "Journal". Prose, poetry, essays and art.'}
      />
      {/* Верхний блок: список слева, арт справа */}
      <Hero />
      {/* Используем то имя, под которым импортировали — NavMenu */}
      <NavMenu isHome />

      {/* Секция LATEST */}
      <ArticleSection 
        title={t('latest')} 
        imageSrc="https://placehold.co/600x400?text=Latest+Image+Removed" 
        articles={latest} 
      />

      {/* Секция POPULAR */}
      <ArticleSection 
        title={t('popular')} 
        imageSrc="https://placehold.co/600x400?text=Popular+Image+Removed" 
        articles={popular} 
        reverse={true} /* Вот эта магия отзеркалит блок! */
      />
    </main>
  );
};

export default Home;