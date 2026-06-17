# Bite & Brew Café Website

Website Link: https://bitebrew.netlify.app/

A premium, modern café website built with Next.js, featuring smooth animations, responsive design, and exceptional user experience.

## 🚀 Features

- **Premium Design**: High-end visual design with glassmorphism effects and smooth animations
- **Smooth Scrolling**: Lenis-powered smooth scrolling for enhanced user experience
- **GSAP Animations**: Advanced scroll-triggered animations and micro-interactions
- **Responsive**: Mobile-first design that works perfectly on all devices
- **TypeScript**: Fully typed for better development experience
- **Performance Optimized**: Lazy loading, optimized animations, and efficient rendering
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP with ScrollTrigger
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
bite-brew/
├── app/
│   ├── components/
│   │   ├── ErrorBoundary.tsx    # Error boundary for production
│   │   └── SmoothScroll.tsx     # Lenis smooth scroll wrapper
│   ├── lib/
│   │   └── gsap.ts             # GSAP setup and plugins
│   ├── sections/
│   │   ├── CTA.tsx             # Premium CTA section
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── Hero.tsx
│   │   ├── Menu.tsx
│   │   ├── Story.tsx
│   │   ├── Testimonials.tsx
│   │   └── Experience.tsx
│   ├── globals.css             # Global styles and utilities
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Home page
├── public/                     # Static assets
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: `#207659` (Deep Teal Green)
- **Secondary**: `#1a5a46` (Darker Teal)
- **Accent**: Warm beige and cream tones
- **Background**: Gradient from cream to warm beige

### Typography
- **Headlines**: Serif font for premium feel
- **Body**: Modern sans-serif for readability
- **Hierarchy**: Clear size and weight scaling

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bite-brew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## 🎯 Component Usage

### CTA Section
```tsx
import CTA from './sections/CTA'

<CTA
  title="Experience the Perfect Brew"
  subtitle="Join us for an unforgettable journey..."
  primaryCTA={{
    text: "Visit Us Today",
    href: "#visit"
  }}
  secondaryCTA={{
    text: "Order Online",
    href: "/order"
  }}
  background={{
    gradient: 'linear-gradient(135deg, #F5F5DC 0%, #DEB887 50%, #D2B48C 100%)'
  }}
  loading={false}
  error={null}
/>
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_SITE_URL=https://bitebrew.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### GSAP Setup
GSAP plugins are registered in `app/lib/gsap.ts`. Add additional plugins here as needed.

### Lenis Configuration
Smooth scrolling is configured in `app/components/SmoothScroll.tsx`. Adjust settings for different scroll behaviors.

## 🎨 Customization

### Colors
Update the primary color in:
- `app/sections/CTA.tsx`
- `app/page.tsx`
- `tailwind.config.js` (if using custom theme)

### Animations
Modify animation timings and effects in the respective component files. All GSAP animations include proper cleanup for performance.

### Typography
Font families are configured in `app/layout.tsx`. Update Google Fonts imports as needed.

## 📱 Responsive Design

- **Mobile**: Single column layout, stacked buttons
- **Tablet**: Two-column layouts where appropriate
- **Desktop**: Full-width sections with optimal spacing

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## 🚀 Performance

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Animation Optimization**: GSAP context cleanup
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🐛 Error Handling

- **Error Boundaries**: Wrap components for graceful error handling
- **Loading States**: Skeleton loaders and spinners
- **Fallback UI**: User-friendly error messages
- **Retry Mechanisms**: Automatic retry for failed operations

## 📈 Analytics & Monitoring

Integrate analytics and monitoring tools:

```tsx
// In layout.tsx or _app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GSAP](https://greensock.com/gsap/) for amazing animations
- [Lenis](https://lenis.studiofreight.com/) for smooth scrolling
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) for the incredible framework

---

Built with ❤️ for coffee lovers everywhere.
