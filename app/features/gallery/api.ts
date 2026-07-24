import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";
import type { GalleryImage, GalleryImageDTO, GalleryResponse, GalleryParams } from "@/app/types/gallery";

/**
 * Maps a DTO from the backend to our frontend GalleryImage type.
 */
function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
    // Handle object format like {"tag1", "tag2"} → Object.values
    if (typeof parsed === "object" && parsed !== null) {
      return Object.values(parsed).filter((v): v is string => typeof v === "string");
    }
    return [];
  } catch {
    return [];
  }
}

function mapGalleryImage(dto: GalleryImageDTO): GalleryImage {
  return {
    id: dto.id,
    src: dto.url || "",
    alt: dto.title || "Gallery image",
    width: 800,
    height: 1000,
    category: dto.category,
    tags: parseTags(dto.tags),
    featured: dto.featured,
    createdAt: dto.uploadedAt,
  };
}

/**
 * Fetch gallery images from the backend with optional pagination, category filtering, and featured flag.
 *
 * @param params - Optional query parameters
 * @param params.page - Page number (default: 1)
 * @param params.limit - Items per page (default: 12)
 * @param params.category - Filter by category: FOOD | INTERIOR | EVENTS
 * @param params.featured - Filter by featured status: true | false
 * @returns Paginated response with mapped GalleryImage[] and pagination info
 */
export async function fetchGalleryImages(
  params: GalleryParams = {}
): Promise<{ data: GalleryImage[]; pagination: GalleryResponse["pagination"] }> {
  const { page = 1, limit = 12, category, featured } = params;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
  };

  if (category) queryParams.category = category;
  if (featured !== undefined) queryParams.featured = featured;

  const response = await axiosInstance.get<GalleryResponse>(ApiEndpoints.listGallery, {
    params: queryParams,
  });

  return {
    data: response.data.data.map(mapGalleryImage),
    pagination: response.data.pagination,
  };
}

