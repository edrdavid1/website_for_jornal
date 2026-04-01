// main.jsx
// Рендер в DOM

import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container.hasChildNodes()) {
  // Если HTML уже сгенерирован (react-snap для поисковиков)
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Обычный рендер (в режиме разработки)
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}