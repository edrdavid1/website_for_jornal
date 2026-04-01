import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useTranslation } from '../context/LanguageContext';
import React from 'react';

// Тестовый компонент, использующий хук перевода
const TestComponent = () => {
  const { lang, t, setLang } = useTranslation();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="welcome">{t('welcome')}</span>
      <button onClick={() => setLang('ru')}>Change to RU</button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('should provide default language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('should change language and persist to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    act(() => {
      screen.getByText('Change to RU').click();
    });

    expect(screen.getByTestId('lang').textContent).toBe('ru');
    expect(spy).toHaveBeenCalledWith('app_lang', 'ru');
  });
});
