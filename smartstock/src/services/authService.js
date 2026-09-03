import api from "../services/api";

// Register a new user and return the API response payload.
export const registerUser = async (name,email, password) => {
    try{
        const response = await api.post("/auth/register", { name,email, password });
        return response.data;
    }catch (error) {
        throw error;
    }
}

// Authenticate a user with email and password.
export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    }catch (error) {
        throw error;
    }
}

// End the current authenticated session.
export const logoutUser = async () => {
    try{
        const response = await api.post("/auth/logout");
        return response.data;
    }catch (error) {
        throw error;
    }
} 