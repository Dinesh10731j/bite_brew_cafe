/**
 * Testimonials Types - Premium animated customer quotes
 */

export interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  rating: number
  source?: string
}

export interface TestimonialsProps {
  title: string
  subtitle: string
  testimonials: Testimonial[]
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
}

