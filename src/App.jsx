// App.jsx
// Точка сборки (провайдеры)
import { LanguageProvider } from './context/LanguageContext';
import { HelmetProvider } from 'react-helmet-async';

import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';


const GlobalSVGs = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
    <filter 
      id="glass" 
      x="-50%" 
      y="-50%" 
      width="200%" 
      height="200%" 
      primitiveUnits="objectBoundingBox" 
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
      <feDisplacementMap 
        id="disp" 
        in="blur" 
        in2="SourceGraphic" 
        scale="0.05" 
        xChannelSelector="R" 
        yChannelSelector="G" 
      ></feDisplacementMap>
    </filter>
  </svg>
);

const App = () => {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <GlobalSVGs />
        <AppRoutes />
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;