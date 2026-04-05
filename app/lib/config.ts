// Brand color configuration for Bite & Brew
export const brandConfig = {
  colors: {
    primary: '#207659',
    primaryDark: '#1a5a46',
    accent: '#D2B48C',
    accentDark: '#B8956A',
    coffee: '#6B4423',
    coffeeDark: '#4A2C1A',
    cream: '#f8f5f0',
    lightBg: '#ede8e3',
    mediumBg: '#e8dfd7',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #207659, #1a5a46)',
    secondary: 'linear-gradient(135deg, #f8f5f0, #ede8e3, #e8dfd7)',
    coffee: 'linear-gradient(180deg, #D2B48C, #B8956A)',
    coffeeFill: 'linear-gradient(180deg, #6B4423, #4A2C1A)',
  },
  animations: {
    duration: {
      short: 0.3,
      medium: 0.6,
      long: 1,
    },
    easing: {
      smooth: 'power3.out',
      bounce: 'back.out(1.5)',
      linear: 'power0.inOut',
    },
  },
}

export type BrandConfig = typeof brandConfig
