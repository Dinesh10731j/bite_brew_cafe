export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: 'coffee' | 'food' | 'tea' | 'pastries' | 'interior' | 'vibes';
}

/* generateGalleryImages removed to fix hydration - replaced with static data below */

export const initialGalleryData: GalleryImage[] = [
  {
    id: "img-coffee-1",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    alt: "coffee at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "coffee"
  },
  {
    id: "img-pastries-1",
    src: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
    alt: "pastries at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "pastries"
  },
  {
    id: "img-interior-1",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "interior"
  },
  {
    id: "img-food-1",
    src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "food"
  },
  {
    id: "img-tea-1",
    src: "https://images.unsplash.com/photo-1544787210-2211d44b565a?auto=format&fit=crop&w=800&q=80",
    alt: "tea at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "tea"
  },
  {
    id: "img-vibes-1",
    src: "https://images.unsplash.com/photo-1493857671297-66f5b5f8b6f8?auto=format&fit=crop&w=800&q=80",
    alt: "vibes at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "vibes"
  },
  {
    id: "img-coffee-2",
    src: "https://images.unsplash.com/photo-1512568400610-3f3f73dccb14?auto=format&fit=crop&w=800&q=80",
    alt: "coffee at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "coffee"
  },
  {
    id: "img-pastries-2",
    src: "https://images.unsplash.com/photo-1562440499-64e194adffa7?auto=format&fit=crop&w=800&q=80",
    alt: "pastries at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "pastries"
  },
  {
    id: "img-interior-2",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "interior"
  },
  {
    id: "img-food-2",
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "food"
  },
  {
    id: "img-tea-2",
    src: "https://images.unsplash.com/photo-1572117613876-f9ce8171bfd8?auto=format&fit=crop&w=800&q=80",
    alt: "tea at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "tea"
  },
  {
    id: "img-vibes-2",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    alt: "vibes at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "vibes"
  },
  {
    id: "img-coffee-3",
    src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    alt: "coffee at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "coffee"
  },
  {
    id: "img-pastries-3",
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    alt: "pastries at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "pastries"
  },
  {
    id: "img-interior-3",
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "interior"
  },
  {
    id: "img-food-3",
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "food"
  },
  {
    id: "img-tea-3",
    src: "https://images.unsplash.com/photo-1586677859456-0c95f7ba0b9b?auto=format&fit=crop&w=800&q=80",
    alt: "tea at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "tea"
  },
  {
    id: "img-vibes-3",
    src: "https://images.unsplash.com/photo-1469362102473-8622cfb973cd?auto=format&fit=crop&w=800&q=80",
    alt: "vibes at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "vibes"
  },
  {
    id: "img-coffee-4",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    alt: "coffee at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "coffee"
  },
  {
    id: "img-pastries-4",
    src: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
    alt: "pastries at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "pastries"
  },
  {
    id: "img-interior-4",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "interior"
  },
  {
    id: "img-food-4",
    src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "food"
  },
  {
    id: "img-tea-4",
    src: "https://images.unsplash.com/photo-1544787210-2211d44b565a?auto=format&fit=crop&w=800&q=80",
    alt: "tea at Bite & Brew",
    width: 800,
    height: 1000,
    aspectRatio: "4/5",
    category: "tea"
  },
  {
    id: "img-vibes-4",
    src: "https://images.unsplash.com/photo-1493857671297-66f5b5f8b6f8?auto=format&fit=crop&w=800&q=80",
    alt: "vibes at Bite & Brew",
    width: 800,
    height: 800,
    aspectRatio: "1/1",
    category: "vibes"
  }
];
