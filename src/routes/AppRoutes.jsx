import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/utils/ScrollToTop';
import Skeleton from '../components/common/Skeleton/Skeleton';

// Ленивая загрузка страниц
const Home = lazy(() => import('../pages/Home'));
const Works = lazy(() => import('../pages/Works'));
const ArticleDetail = lazy(() => import('../pages/ArticleDetail'));
const About = lazy(() => import('../pages/About'));
const Archive = lazy(() => import('../pages/Archive'));
const AuthorsList = lazy(() => import('../pages/AuthorsList'));
const AuthorPage = lazy(() => import('../pages/Authors'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const Issue = lazy(() => import('../pages/Issue'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Компонент загрузки
const Loading = () => (
  <div style={{ 
    padding: '2rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <Skeleton variant="text" width="60%" height="2.5rem" style={{ marginBottom: '1rem' }} />
    <Skeleton variant="text" width="100%" height="1rem" />
    <Skeleton variant="text" width="95%" height="1rem" />
    <Skeleton variant="text" width="98%" height="1rem" />
    <Skeleton variant="text" width="40%" height="1rem" />
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-wrapper">
        <Header />

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/current_issue" element={<Issue />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/works" element={<Works />} />
            <Route path="/works/:category" element={<Works />} />
            <Route path="/authors/:category" element={<AuthorsList />} />
            <Route path="/authors" element={<Navigate to="/authors/writers" replace />} />
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/issue/:id" element={<Issue />} />
            <Route path="/about" element={<About />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </BrowserRouter>
  );
}