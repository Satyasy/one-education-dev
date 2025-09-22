import apiClient from "./axiosConfig";
import { User } from "../types/auth";
import { AxiosError } from "axios";

const authService = {
    getUser: async (): Promise<User | null> => {
        try {
            const response = await apiClient.get("/user");
            return response.data;
        } catch (error) {
            console.error("Error in getUser:", error);
            if (error instanceof AxiosError) {
                console.error("AxiosError details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });
                throw error.response?.data;
            }
            throw error;
        }
    },
    login: async (email: string, password: string): Promise<User> => {
        try {
            const response = await apiClient.post("/auth/sign-in", { email, password });
            return response.data;
        } catch (error) {
            console.error("Error in login:", error);
            if (error instanceof AxiosError) {
                console.error("Login AxiosError details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });
                throw error.response?.data;
            }
            throw error;
        }
    },
    logout: async (): Promise<void> => {
        try {
            const response = await apiClient.post("/auth/sign-out");
            return response.data;
        } catch (error) {
            console.error("Error in logout:", error);
            if (error instanceof AxiosError) {
                throw error.response?.data;
            }
            throw error;
        }
    },
};

export default authService;
