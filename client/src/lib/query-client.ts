import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: (failureCount, error) => {
                const axiosError = error as AxiosError;
                if (
                    axiosError?.response?.status &&
                    axiosError.response.status >= 400 &&
                    axiosError.response.status < 500
                ) {
                    return false;
                }
                return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            networkMode: "online",
        },
        mutations: {
            retry: false,
            networkMode: "online",
        },
    },
});
