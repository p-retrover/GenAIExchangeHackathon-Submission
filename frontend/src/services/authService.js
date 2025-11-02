import { apiClient } from './api';
import { jwtDecode } from 'jwt-decode';

/**
 * Gets the current user by validating the token and fetching user data.
 * @returns {Promise<object|null>} The user object or null if not authenticated.
 */
const getCurrentUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('authToken');
            return null;
        }

        // Set the authorization header for all subsequent apiClient requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch the full user details from the secure /users/me endpoint
        const response = await apiClient.get('/users/me');
        return response.data;

    } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem('authToken');
        delete apiClient.defaults.headers.common['Authorization'];
        return null;
    }
};

/**
 * Logs the user out by clearing the token.
 */
const logout = () => {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
};

export const authService = {
    getCurrentUser,
    logout,
};