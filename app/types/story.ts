import { LucideIcon } from 'lucide-react'

export interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  icon?: LucideIcon
}

export interface StoryProps {
  title?: string
  subtitle?: string
  timeline?: TimelineItem[]
  primaryCTA?: {
    href: string
    text: string
  }
  secondaryCTA?: {
    href: string
    text: string
  }
}

export const sampleTimeline: TimelineItem[] = [
  {
    id: '1',
    year: '2005',
    title: 'Bean to Bold',
    description: 'Born in a tiny garage roastery with nothing but passion, premium beans, and a dream to brew something different.',
    icon: undefined
  },
  {
    id: '2',
    year: '2012',
    title: 'Urban Expansion',
    description: 'Conquered the city skyline with 5 flagship locations. Where concrete meets coffee culture.',
    icon: undefined
  },
  {
    id: '3',
    year: '2018',
    title: 'Award Circuit',
    description: 'Roasted our way to 27 major awards. From World Barista to Best Bite in Brew.',
    icon: undefined
  },
  {
    id: '4',
    year: '2023',
    title: 'Global Brew',
    description: 'Launched international pop-ups and online empire. Bite & Brew knows no borders.',
    icon: undefined
  },
  {
    id: '5',
    year: '2025',
    title: 'Next Chapter',
    description: 'Franchise revolution begins. Bringing bold brews to every corner of the earth.',
    icon: undefined
  }
]



