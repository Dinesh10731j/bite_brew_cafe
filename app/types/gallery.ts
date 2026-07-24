// Category types matching the backend API spec
export type GalleryCategory = 'FOOD' | 'INTERIOR' | 'EVENTS';

// Frontend display-friendly image type
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: GalleryCategory;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

// Backend API response shape (single image)
export interface GalleryImageDTO {
  id: string;
  title: string;
  url: string;
  category: GalleryCategory;
  tags: string;
  featured: boolean;
  orderIndex: number;
  uploadedAt: string;
}

// Backend API paginated response
export interface GalleryResponse {
  message: string;
  data: GalleryImageDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Params for fetching gallery images
export interface GalleryParams {
  page?: number;
  limit?: number;
  category?: GalleryCategory;
  featured?: boolean;
}

// Fallback static data for when API is unavailable
export const fallbackGalleryData: GalleryImage[] = [
  {
    id: "img-coffee-1",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    alt: "coffee at Bite & Brew",
    width: 800,
    height: 1000,
    category: "FOOD",
    tags: ["coffee", "morning"],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-pastries-1",
    src: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
    alt: "pastries at Bite & Brew",
    width: 800,
    height: 800,
    category: "FOOD",
    tags: ["pastries", "baking"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-interior-1",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    category: "INTERIOR",
    tags: ["interior", "cozy"],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-food-1",
    src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    category: "FOOD",
    tags: ["food", "dining"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-tea-1",
    src: "https://images.unsplash.com/photo-1544787210-2211d44b565a?auto=format&fit=crop&w=800&q=80",
    alt: "tea at Bite & Brew",
    width: 800,
    height: 1000,
    category: "FOOD",
    tags: ["tea", "beverages"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-vibes-1",
    src: "https://images.unsplash.com/photo-1493857671297-66f5b5f8b6f8?auto=format&fit=crop&w=800&q=80",
    alt: "vibes at Bite & Brew",
    width: 800,
    height: 800,
    category: "EVENTS",
    tags: ["events", "vibes"],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-interior-2",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    category: "INTERIOR",
    tags: ["interior", "design"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-food-2",
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    category: "FOOD",
    tags: ["food", "pizza"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-interior-3",
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    alt: "interior at Bite & Brew",
    width: 800,
    height: 1000,
    category: "INTERIOR",
    tags: ["interior", "modern"],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-food-3",
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    alt: "food at Bite & Brew",
    width: 800,
    height: 800,
    category: "FOOD",
    tags: ["food", "pancakes"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-events-1",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    alt: "events at Bite & Brew",
    width: 800,
    height: 1000,
    category: "EVENTS",
    tags: ["events", "nature"],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "img-coffee-2",
    src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    alt: "coffee at Bite & Brew",
    width: 800,
    height: 1000,
    category: "FOOD",
    tags: ["coffee", "latte"],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

