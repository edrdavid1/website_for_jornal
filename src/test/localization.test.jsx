import { describe, it, expect } from 'vitest';
import { getLocalizedText } from '../components/utils/localization';

describe('getLocalizedText', () => {
  const mockField = {
    en: 'English Text',
    ru: 'Русский текст',
    be: 'Беларускі тэкст'
  };

  it('should return text for the requested language', () => {
    expect(getLocalizedText(mockField, 'ru')).toBe('Русский текст');
    expect(getLocalizedText(mockField, 'en')).toBe('English Text');
  });

  it('should fallback to English if requested language is missing', () => {
    expect(getLocalizedText(mockField, 'lt')).toBe('English Text');
  });

  it('should return the string itself if field is a string', () => {
    expect(getLocalizedText('Simple String', 'en')).toBe('Simple String');
  });

  it('should return empty string if field is null or undefined', () => {
    expect(getLocalizedText(null, 'en')).toBe('');
    expect(getLocalizedText(undefined, 'en')).toBe('');
  });

  it('should return first available value if English is also missing', () => {
    const onlyBe = { be: 'Тэкст' };
    expect(getLocalizedText(onlyBe, 'ru')).toBe('Тэкст');
  });
});
