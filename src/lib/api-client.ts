import axios from "axios";

// Relative URLs so this app is "same-origin" even though the backend runs on
// a different port/host — Next.js rewrites (next.config.ts) proxy /api/*.
export const apiClient = axios.create({
    baseURL: "",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Mirrors TRAILBLAZER-frontend/lib/api-client.ts: share one in-flight refresh
// across concurrent 401s so a burst of requests doesn't race the backend's
// refresh-token rotation and spuriously log the admin out.
let refreshPromise: Promise<unknown> | null = null;

function refreshTokens() {
    if (!refreshPromise) {
        refreshPromise = axios
            .post("/api/v1/admin/auth/refresh", {}, { withCredentials: true })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshTokens();
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
