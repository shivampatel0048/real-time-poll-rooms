import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL!}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "An unexpected error occurred";

        if (error.response?.data) {
            const data = error.response.data;

            if (data.error) {
                if (typeof data.error === "string") {
                    errorMessage = data.error;
                } else if (data.error.message) {
                    errorMessage = data.error.message;
                } else if (data.error.code) {
                    errorMessage = `Error: ${data.error.code}`;
                }
            }
        } else if (error.message) {
            if (error.code === "NETWORK_ERROR") {
                errorMessage = "Network error - please check your connection";
            } else if (error.code === "ECONNABORTED") {
                errorMessage = "Request timed out - please try again";
            } else {
                errorMessage = error.message;
            }
        }

        toast.error(errorMessage);

        return Promise.reject({ ...error, customMessage: errorMessage });
    }
);
