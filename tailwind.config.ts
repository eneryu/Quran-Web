import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald 500
          dark: '#059669',    // Emerald 600
        },
        accent: {
          DEFAULT: '#fbbf24', // Amber 400 (Gold)
          dark: '#f59e0b',   // Amber 500
        },
        dark: {
          DEFAULT: '#020617', // Slate 950
          card: '#0f172a',    // Slate 900
          lighter: '#1e293b', // Slate 800
        },
        light: '#f8fafc',    // Slate 50
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      fontFamily: {
        sans: ['var(--font-kufi)', 'Inter', 'system-ui'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      boxShadow: {
        'premium': '0 0 50px -12px rgba(16, 185, 129, 0.25)',
        'gold': '0 0 50px -12px rgba(251, 191, 36, 0.25)',
      },
      animation: {
        shine: 'shine 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
