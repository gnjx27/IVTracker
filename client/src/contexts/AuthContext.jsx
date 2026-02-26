import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const access = localStorage.getItem("access_token");
        if (!access) return null;

        try {
            const decoded = jwtDecode(access);
            return { id: decoded.user_id }
        } catch (err) {
            console.error("Invalid token: ", err.message);
            return null;
        }
    });

    const login = async (credentials) => {
        try {
            // Try logging in with credentials to get JWT
            const response = await api.post("/user/token/", credentials);
            const {access, refresh} = response.data;
            // Decode access token
            const decoded = jwtDecode(access)
            // Save tokens and user id in local storage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user_id", decoded.user_id);
            setUser({ id: decoded.user_id })
        } catch (err) {
            throw err.response?.data || err;
        }
    };

    const register = async (credentials) => {
        try {
            // Try registering with credentials
            const response = await api.post("/user/register/", credentials);
            const {access, refresh} = response.data;
            // Decode access token
            const decoded = jwtDecode(access)
            // Save tokens and user id in local storage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user_id", decoded.user_id);
            setUser({ id: decoded.user_id })
        } catch (err) {
            throw err.response?.data || err;
        }
    }

    const refreshAccessToken = async () => {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) return null;

        try {
            const response = await axios.post("/api/user/token/refresh", {
                refresh: refresh
            });
            const { access } = response.data;
            localStorage.setItem("access_token", access);
            return access;
        } catch (err) {
            console.error("Refresh token failed: ", err.message);
            setUser(null); // Force logout if refresh fails
            return null;
        }
    }

    const logout = async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        setUser(null);
    }

    // Provide context to all children
    return (
        <AuthContext.Provider value={{ login, register, user, refreshAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};