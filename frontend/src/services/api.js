import axios from 'axios';

// This creates a pre-configured axios instance for all our API calls
export const apiClient = axios.create({
    baseURL: '/api/v1', // This works with the Vite proxy
    headers: {
        'Content-Type': 'application/json'
    }
});