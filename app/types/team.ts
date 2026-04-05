export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string; // Optional for avatar
}

export const sampleTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Elena Vasquez',
    role: 'Master Roaster',
    bio: '20+ years crafting perfect roasts. Knows every bean by name. The aroma architect behind our signature blends.',
  },
  {
    id: '2',
    name: 'Marcus Lee',
    role: 'Head Barista',
    bio: 'World Barista Championship finalist. Turns 7 seconds into art. Precision pours that tell stories.',
  },
  {
    id: '3',
    name: 'Sofia Grant',
    role: 'Pastry Chef',
    bio: "Flaky layers meet bold flavors. Bakery science meets café soul. Every bite engineered for maximum satisfaction.",
  },
  {
    id: '4',
    name: 'Jamal Ortiz',
    role: 'Operations Lead',
    bio: 'Keeps the empire brewing smoothly. From bean delivery to perfect timing. The invisible hand of excellence.',
  },
  {
    id: '5',
    name: 'Lila Chen',
    role: 'Experience Curator',
    bio: 'Designs the vibe that keeps you coming back. Ambiance alchemist turning coffee into community.',
  }
];

