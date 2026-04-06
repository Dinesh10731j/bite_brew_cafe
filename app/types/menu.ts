export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'coffee' | 'food' | 'tea' | 'pastries';
  image?: string; // Optional image path
  allergens?: string[];
}

export interface MenuSection {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export const sampleMenuSections: MenuSection[] = [
  {
    title: 'Coffee Classics',
    subtitle: 'Sourced from the finest estates, roasted in-house daily.',
    items: [
      {
        id: 'espresso',
        name: 'Single Origin Espresso',
        description: 'Rich, bold shot from rotating single origins.',
        price: '$3.50',
        category: 'coffee',
        allergens: [],
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        description: 'Silky microfoam atop bold espresso.',
        price: '$4.50',
        category: 'coffee',
        allergens: ['dairy'],
      },
      {
        id: 'latte',
        name: 'Signature Latte',
        description: 'Velvety steamed milk with caramel notes.',
        price: '$5.00',
        category: 'coffee',
        allergens: ['dairy'],
      },
      {
        id: 'cold-brew',
        name: 'Nitro Cold Brew',
        description: 'Smooth, creamy cold brew on nitrogen.',
        price: '$5.50',
        category: 'coffee',
      },
    ],
  },
  {
    title: 'Fresh Bites',
    subtitle: 'Handcrafted pastries & savory options.',
    items: [
      {
        id: 'croissant',
        name: 'Butter Croissant',
        description: 'Flaky, golden layers of pure butter.',
        price: '$4.00',
        category: 'pastries',
        allergens: ['gluten', 'dairy'],
      },
      {
        id: 'avocado-toast',
        name: 'Avocado Toast',
        description: 'House sourdough, smashed avo, chili flakes.',
        price: '$8.50',
        category: 'food',
        allergens: ['gluten'],
      },
      {
        id: 'muffin',
        name: 'Blueberry Crumble Muffin',
        description: 'Fresh berries with streusel topping.',
        price: '$4.50',
        category: 'pastries',
        allergens: ['gluten', 'dairy', 'eggs'],
      },
    ],
  },
  {
    title: 'Brewed Teas & More',
    subtitle: 'Artisanal selections beyond coffee.',
    items: [
      {
        id: 'matcha-latte',
        name: 'Matcha Latte',
        description: 'Ceremonial grade matcha, steamed milk.',
        price: '$5.50',
        category: 'tea',
        allergens: ['dairy'],
      },
      {
        id: 'chai',
        name: 'Masala Chai',
        description: 'Spiced black tea, steamed milk.',
        price: '$4.75',
        category: 'tea',
        allergens: ['dairy'],
      },
    ],
  },
];
