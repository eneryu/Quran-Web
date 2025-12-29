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
          DEFAULT: '#8b5cf6', // Violet 500
          dark: '#7c3aed',    // Violet 600
        },
        accent: {
          DEFAULT: '#f472b6', // Pink 400
          dark: '#db2777',    // Pink 600
        },
        dark: {
          DEFAULT: '#0f0f0f', // Near black (Matches personal-portfolio)
          card: '#1a1a1a',    // Dark grey
          lighter: '#262626',
        },
        light: '#ffffff',
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
        'premium': '0 0 50px -12px rgba(139, 92, 246, 0.25)',
        'accent': '0 0 50px -12px rgba(244, 114, 182, 0.25)',
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
