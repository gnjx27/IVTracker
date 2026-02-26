import axios from "axios";

const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    try {
        const response = await axios.post("/api/user/token/refresh", { refresh });
        const { access } = response.data;
        localStorage.setItem("access_token", access);
        return access;
    } catch (err) {
        console.error("Refresh token failed: ", err.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        return null;
    }
}

const api = axios.create({
    baseURL: "/api"
})

// Request interceptor to attach accesss token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

// Response interceptor to handle 401 (token expired)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem("refresh_token")) {
            originalRequest._retry = true;
            const newAccess = await refreshAccessToken();
            if (newAccess) {
                localStorage.setItem("access_token", newAccess);
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest); // Retry the original request
            }
        }
        return Promise.reject(error);
    }
)

export default api;