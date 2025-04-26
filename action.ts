import axios from "axios";

export async function getAccessToken(): Promise<string | null> {
    try {
        // Request a new access token
        const response = await axios.post(
            "http://localhost:6969/api/auth/refresh",
            {},
            {
                withCredentials: true,
            }
        );
        const newAccessToken = response.data.accessToken;
        // Store the new access token
        localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken; // Return the new token
    } catch (error) {
        console.log("Error while refreshing access token:", error);
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            // Handle invalid or expired refresh token
            if (status === 401 || status === 403) {
                console.warn("Refresh token is invalid or expired. Logging out...");
                await handleLogout(); // Log the user out
                return null;
            }

            // Handle network errors
            if (!error.response) {
                console.error("Network error occurred while refreshing access token.");
            } else {
                console.error("Failed to refresh access token:", error.response?.data || error.message);
            }
        } else {
            console.error("Unexpected error while refreshing access token:", error);
        }

        return null; 
    }
}

export async function handleLogout(): Promise<void> {
    try {
        // Make a request to the backend to clear the HTTP-only cookies
        await axios.post(
            "http://localhost:6969/api/auth/logout",
            {}, { withCredentials: true, }
        );

        console.log("Successfully logged out from the server.");
    } catch (error) {
        console.error("Error during logout:", error);
    } finally {
        // Clear localStorage or any other client-side session data
        localStorage.removeItem("accessToken");
        localStorage.clear();

        // Redirect the user to the login page
        window.location.href = "/Login";
    }
}



export async function isLoggedIn(): Promise<boolean> {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.warn("No access token found. User is not logged in.");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error while checking login status:", error);
        return false;
    }
}
