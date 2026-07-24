import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";
import type { TeamMember } from "@/app/types/team";

export type StaffResponse = {
  message: string;
  data: StaffMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isCached: boolean;
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchStaff = async (): Promise<TeamMember[]> => {
  const response = await axiosInstance.get<StaffResponse>(ApiEndpoints.listStaff);
  
  return response.data.data.map((staff) => ({
    id: staff.id,
    name: staff.name,
    role: staff.role === "admin" ? "Master Roaster" : staff.role === "manager" ? "Head Barista" : staff.role,
    bio: `A valued member of the Bite & Brew family, bringing passion and expertise to every cup.`,
    image: staff.image ?? undefined,
  }));
};

