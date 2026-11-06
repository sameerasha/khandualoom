/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Semantic theme-token mappings
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'surface-sunken': 'var(--color-surface-sunken)',
        'nav-background': 'var(--color-nav-background)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-gold': 'var(--color-text-gold)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-strong': 'var(--color-border-strong)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
        },
        'input-background': 'var(--color-input-background)',
        'input-border': 'var(--color-input-border)',

        // Existing brand palette preserved for backwards compatibility
        brand: {
          purple: {
            DEFAULT: '#4A0E4E',
            light: '#6E1B74',
            dark: '#300833',
          },
          gold: {
            DEFAULT: '#C5A059',
            light: '#DFBF7A',
            dark: '#9E7D3B',
          },
          crimson: '#7A0016',
          emerald: '#004D40',
          ivory: '#FDFBF7',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
