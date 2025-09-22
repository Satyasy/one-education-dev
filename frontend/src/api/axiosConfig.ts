import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(async (config) => {
    if(config.url?.includes("/login")) {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
            withCredentials: true,
            withXSRFToken: true,
        });
    }
    return config;
});

export default apiClient;
