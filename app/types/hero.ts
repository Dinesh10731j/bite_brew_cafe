/**
 * Premium Hero Types - Cinematic scroll-driven experience
 */

export interface CTAButton {
  text: string
  href: string
  onClick?: () => void
}

export interface HeroProps {
  /** Main brand title */
  title: string
  /** Engaging tagline */
  tagline: string
  /** Descriptive subtitle */
  description: string
  /** Primary and secondary CTAs */
  ctas: CTAButton[]
  /** Parallax intensity (0-1) */
  parallaxIntensity?: number
  /** Theme variant */
  variant?: 'standard' | 'cinematic' | 'compact'
  /** Background layers config */
  parallaxLayers?: {
    bgSpeed?: number
    midSpeed?: number
  }
}
