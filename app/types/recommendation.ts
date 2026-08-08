// ============================================================
// Bite & Brew — AI Recommendation Service Types
// Mirrors the FastAPI data models documented in the AI service.
// ============================================================

/** Category details object returned for a dish recommendation. */
export interface CategoryDetails {
  id?: string | null;
  name?: string | null;
  description?: string | null;
}

/** A single menu item returned in recommendation results. */
export interface DishRecommendation {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  image_url?: string | null;
  category?: string | CategoryDetails | null;
  categoryId?: string | null;
  available?: boolean;
  featured?: boolean;
  discount?: number;
  popularity?: number;
  is_vegetarian?: boolean;
  match_score?: number;
  distance?: number;
}

/** Echo of the pre-filters applied to a recommendation query. */
export interface RecommendationFiltersApplied {
  max_price?: number | null;
  category?: string | null;
}

/** Request body for POST /api/v1/recommend */
export interface RecommendationRequest {
  user_craving: string;
  max_price?: number | null;
  category?: string | null;
  top_n?: number;
}

/** Response body for POST /api/v1/recommend */
export interface RecommendationResponse {
  status: string;
  query_craving: string;
  filters_applied?: RecommendationFiltersApplied;
  total_matches: number;
  recommendations: DishRecommendation[];
  cached?: boolean;
}

/** Request body for POST /api/v1/users/{user_id}/events */
export interface UserEventRequest {
  menu_item_id: string | number;
  event_type: "view" | "like" | "favorite" | "add_to_cart" | "click" | "order";
  metadata?: Record<string, unknown>;
}

/** Response body for POST /api/v1/users/{user_id}/events */
export interface EventProcessedResponse {
  status: string;
  user_id: string;
  event_type: string;
  menu_item_id: string | number;
  timestamp: string;
}

/** A single line item within an order. */
export interface UserOrderItem {
  menu_item_id: string | number;
  quantity?: number;
  price?: number;
}

/** Request body for POST /api/v1/users/{user_id}/orders */
export interface UserOrderRequest {
  items: UserOrderItem[];
  total?: number;
  status?: string;
}

/** Response body for POST /api/v1/users/{user_id}/orders */
export interface OrderProcessedResponse {
  status: string;
  user_id: string;
  order_id: string | number;
  total: number;
  timestamp: string;
}

/** Summary of a user's learned taste profile. */
export interface UserPreferenceSummary {
  favorite_categories: string[];
  total_orders: number;
  total_events: number;
  has_preference_profile: boolean;
}

/** Query params for GET /api/v1/users/{user_id}/recommendations */
export interface PersonalizedRecommendationParams {
  user_craving?: string;
  max_price?: number;
  category?: string;
  top_n?: number;
}

/** Response body for GET /api/v1/users/{user_id}/recommendations */
export interface PersonalizedRecommendationResponse {
  user_id: string;
  status: string;
  query_craving?: string | null;
  filters_applied?: RecommendationFiltersApplied;
  preference_summary?: UserPreferenceSummary;
  total_matches: number;
  recommendations: DishRecommendation[];
  cached?: boolean;
}
