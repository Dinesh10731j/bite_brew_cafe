import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string | null;
  available: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
};

export type MenusResponse = {
  message: string;
  data: MenuItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FetchMenusParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  available?: boolean;
};

export const fetchMenus = async ({
  page = 1,
  limit = 12,
  search,
  categoryId,
  available,
}: FetchMenusParams = {}): Promise<MenusResponse> => {
  const response = await axiosInstance.get<MenusResponse>(ApiEndpoints.listMenus, {
    params: { page, limit, search, categoryId, available },
  });
  return response.data;
};

export const list_menus = fetchMenus;
