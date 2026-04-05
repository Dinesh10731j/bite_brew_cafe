import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
colors: {
        brand: {
          espresso: '#6B4423',
          espressoDark: '#4A2C1A',
          latte: '#D2B48C',
          cream: '#F8F5F0',
          beige: '#EDE8E3',
          gold: '#DAA520',
          forest: '#4B9360',
          mint: '#8EC894',
          charcoal: '#1A1A1A',
          silver: '#BDBDBD',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Times New Roman', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'brew': 'brew 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
export default config
