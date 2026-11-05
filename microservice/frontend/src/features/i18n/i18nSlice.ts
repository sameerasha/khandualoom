import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageCode, translations, Translations } from '@/i18n/translations';
import { RootState } from '@/app/store';

interface I18nState {
  currentLanguage: LanguageCode;
}

const LANGUAGE_STORAGE_KEY = 'khandua_language';

const loadLanguage = (): LanguageCode => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'or' || saved === 'hi') {
      return saved;
    }
  } catch {}
  return 'en';
};

const initialState: I18nState = {
  currentLanguage: loadLanguage(),
};

export const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.currentLanguage = action.payload;
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, action.payload);
      } catch (err) {
        console.error('Failed to save language to storage', err);
      }
    },
  },
});

export const { setLanguage } = i18nSlice.actions;

export const selectCurrentLanguage = (state: RootState): LanguageCode =>
  state.i18n.currentLanguage;

export const selectTranslations = (state: RootState): Translations =>
  translations[state.i18n.currentLanguage] || translations.en;

export default i18nSlice.reducer;
