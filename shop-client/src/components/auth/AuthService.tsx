import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

const AuthService = () => {
    const login = (username: string, password: string) => {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    };

    const logout = () => {
        localStorage.removeItem("user");
    };

    const register = (username: string, email: string, password: string) => {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    };

    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        try {
            if (userStr) {
                return JSON.parse(userStr);
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
        return null;
    };

    return {
        login,
        logout,
        register,
        getCurrentUser
    };
};

export default AuthService();