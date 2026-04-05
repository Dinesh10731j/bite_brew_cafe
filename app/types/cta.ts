/** 
 * CTA Types - Used in app/sections/CTA.tsx
 */

export interface CTAButton {
  text: string
  href: string
}

export interface CTAProps {
  title: string
  subtitle: string
  primaryCTA: CTAButton
  secondaryCTA?: CTAButton
}

