/** 
 * Premium CTA Types - Modular, extensible for high-end marketing sites
 * @packageDocumentation 
 */

export enum CTAVariant {
  STANDARD = 'standard',
  HERO = 'hero',
  COMPACT = 'compact'
}

export enum CTATheme {
  COFFEE = 'coffee',
  PREMIUM = 'premium',
  DARK = 'dark'
}

export interface CTAButton {
  /** Button display text */
  text: string
  /** Navigation URL */
  href?: string
  /** Click handler */
  onClick?: () => void
  /** Optional variant */
  variant?: 'primary' | 'secondary'
}

export interface BackgroundConfig {
  /** Background image URL */
  image?: string
  /** CSS gradient string */
  gradient?: string
  /** Parallax intensity (0-1) */
  parallax?: number
}

export interface CTAProps {
  /** Main headline */
  title: string
  /** Descriptive subtitle */
  subtitle: string
  /** Primary call-to-action button */
  primaryCTA: CTAButton
  /** Optional secondary button */
  secondaryCTA?: CTAButton
  /** Background configuration */
  background?: BackgroundConfig
  /** Loading state */
  loading?: boolean
  /** Error message */
  error?: string | null
  /** Component size variant */
  variant?: CTAVariant
  /** Color theme */
  theme?: CTATheme
  /** Auto-hide after duration (ms) */
  autoHide?: number
}
