import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/axios-instance";

// Example: GET query hook
export const useFetchData = <T = any>(
  endpoint: string,
  enabled: boolean = true,
  queryKey: string = endpoint,
) => {
  return useQuery<T, AxiosError>({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await api.get<T>(endpoint);
      return response.data;
    },
    enabled,
  });
};

// Example: POST mutation hook
export const useCreateData = <T = any, D = any>(endpoint: string) => {
  return useMutation<T, AxiosError, D>({
    mutationFn: async (data: D) => {
      const response = await api.post<T>(endpoint, data);
      return response.data;
    },
  });
};

// Example: PUT mutation hook (update)
export const useUpdateData = <T = any, D = any>(endpoint: string) => {
  return useMutation<T, AxiosError, D>({
    mutationFn: async (data: D) => {
      const response = await api.put<T>(endpoint, data);
      return response.data;
    },
  });
};

// Example: DELETE mutation hook
export const useDeleteData = <T = any>(endpoint: string) => {
  return useMutation<T, AxiosError>({
    mutationFn: async () => {
      const response = await api.delete<T>(endpoint);
      return response.data;
    },
  });
};
