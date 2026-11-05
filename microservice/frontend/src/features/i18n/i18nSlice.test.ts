import i18nReducer, { setLanguage } from './i18nSlice';
import { translations } from '@/i18n/translations';

describe('i18n Redux Slice', () => {
  const initialState = { currentLanguage: 'en' as const };

  it('should initialize with default english language', () => {
    expect(initialState.currentLanguage).toBe('en');
  });

  it('should switch to Odia language', () => {
    const nextState = i18nReducer(initialState, setLanguage('or'));
    expect(nextState.currentLanguage).toBe('or');
    expect(translations[nextState.currentLanguage].collections).toBe('ସଂଗ୍ରହ');
  });

  it('should switch to Hindi language', () => {
    const nextState = i18nReducer(initialState, setLanguage('hi'));
    expect(nextState.currentLanguage).toBe('hi');
    expect(translations[nextState.currentLanguage].collections).toBe('कलेक्शंस');
  });
});
