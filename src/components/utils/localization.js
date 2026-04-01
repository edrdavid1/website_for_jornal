// utils/localization.js
export const getLocalizedText = (field, currentLang) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[currentLang] || field['en'] || Object.values(field)[0] || '';
};