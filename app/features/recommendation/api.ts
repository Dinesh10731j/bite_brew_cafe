// ============================================================
// Bite & Brew — AI Menu Recommendation Service API
// Integrates the separate AI microservice (http://localhost:8000)
// ============================================================

import { recommendationAxiosInstance } from "@/app/lib/api/axiosInstance";
import { AiRecommendationEndpoints } from "@/app/lib/api/endpoints";
import type {
  RecommendationRequest,
  RecommendationResponse,
  UserEventRequest,
  EventProcessedResponse,
  UserOrderRequest,
  OrderProcessedResponse,
  PersonalizedRecommendationResponse,
  PersonalizedRecommendationParams,
} from "@/app/types/recommendation";

const parseError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { detail?: string; message?: string } };
    };
    const data = axiosError.response?.data;
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

/**
 * Main AI menu recommendation function.
 * Converts a natural-language craving into menu recommendations.
 */
export const aiRecommend = async (
  craving: string,
  filters?: { maxPrice?: number; category?: string; topN?: number }
): Promise<RecommendationResponse> => {
  const payload: RecommendationRequest = {
    user_craving: craving,
    max_price: filters?.maxPrice ?? null,
    category: filters?.category ?? null,
    top_n: filters?.topN ?? 3,
  };
  try {
    const response = await recommendationAxiosInstance.post<RecommendationResponse>(
      AiRecommendationEndpoints.recommend,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

/** Convenience alias for `aiRecommend`. */
export const aiMenuRecommendation = aiRecommend;

/**
 * Capture a user behavior event (view, like, favorite, add_to_cart, click, order).
 */
export const captureRecommendationEvent = async (
  userId: string,
  event: UserEventRequest
): Promise<EventProcessedResponse> => {
  try {
    const response = await recommendationAxiosInstance.post<EventProcessedResponse>(
      AiRecommendationEndpoints.captureEvent(userId),
      event
    );
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

/**
 * Record a user's order (with items) as a strong preference signal.
 */
export const recordRecommendationOrder = async (
  userId: string,
  order: UserOrderRequest
): Promise<OrderProcessedResponse> => {
  try {
    const response = await recommendationAxiosInstance.post<OrderProcessedResponse>(
      AiRecommendationEndpoints.recordOrder(userId),
      order
    );
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

/**
 * Get personalized recommendations for a user based on events/orders.
 * Optionally blended with a live craving query.
 */
export const getPersonalizedRecommendations = async (
  userId: string,
  params: PersonalizedRecommendationParams = {}
): Promise<PersonalizedRecommendationResponse> => {
  try {
    const queryParams: Record<string, string | number | undefined> = {
      top_n: params.top_n ?? 5,
      max_price: params.max_price,
    };
    if (params.user_craving) queryParams.user_craving = params.user_craving;
    if (params.category) queryParams.category = params.category;

    const response =
      await recommendationAxiosInstance.get<PersonalizedRecommendationResponse>(
        AiRecommendationEndpoints.personalizedRecommendations(userId),
        { params: queryParams }
      );
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};
