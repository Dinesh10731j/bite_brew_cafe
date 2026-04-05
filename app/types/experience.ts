import { LucideIcon } from 'lucide-react'

export interface ExperienceItem {
  id: string
  title: string
  description: string
  sensoryDetail: string
  icon?: LucideIcon
}

export interface ExperienceProps {
  title?: string
  subtitle?: string
  experiences?: ExperienceItem[]
  primaryCTA?: {
    href: string
    text: string
  }
  secondaryCTA?: {
    href: string
    text: string
  }
}

export const sampleExperiences: ExperienceItem[] = [
  {
    id: '1',
    title: 'Morning Ritual',
    description: 'Freshly roasted beans grind with rich aroma filling the air. Your day begins with precision pour-over, crafted by hands that know every bean.',
    sensoryDetail: 'Warm sunlight filters through oak windows • First sip cuts crisp at 7:03 AM'
  },
  {
    id: '2',
    title: 'Afternoon Escape',
    description: 'Velvet espresso meets flaky artisan pastry. The world fades as leather seats embrace you in golden hour glow.',
    sensoryDetail: 'Butter layers crack • Espresso steam curls like whispered secrets'
  },
  {
    id: '3',
    title: 'Evening Vibe',
    description: 'Bold cold brew ignites conversations under ambient lights. Savory bites fuel debates that last past closing.',
    sensoryDetail: 'Ice clinks rhythmically • Jazz notes linger in roasted air'
  },
  {
    id: '4',
    title: 'Night Cap',
    description: 'Decaf dreams in moonlit corners. Final bite lingers as the city hums outside our sanctuary windows.',
    sensoryDetail: 'Silk smooth finish • Streetlights paint golden halos on porcelain'
  },
  {
    id: '5',
    title: 'Weekend Haven',
    description: 'Lazy brunch symphony: fluffy pancakes drown in maple, paired with slow-drip nitro cascading over silk ice.',
    sensoryDetail: 'Maple drips slow • Laughter bounces off exposed brick'
  }
]

// Removed invalid default export of interface


