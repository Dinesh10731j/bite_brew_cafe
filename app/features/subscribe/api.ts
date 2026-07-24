import { AxiosError } from "axios";
import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";

type SubscribeResponse = {
  message: string;
  status: number;
};

const parseError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    const message = responseData?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
    if (responseData?.error) {
      return responseData.error;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

export const subscribeApi = {
  async subscribe(email: string): Promise<SubscribeResponse> {
    try {
      const response = await axiosInstance.post(
        ApiEndpoints.subscribe,
        { email }
      );
      return {
        message: response.data?.message ?? "Subscribed successfully!",
        status: response.status,
      };
    } catch (error) {
      throw new Error(parseError(error));
    }
  },
};

