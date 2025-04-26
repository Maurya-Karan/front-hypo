import { io, Socket } from "socket.io-client";
import { getAccessToken } from "../../action"; // Adjust the import path as necessary
import { get } from "http";
let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket | String | null> {
    console.log("Entered connectSocket function");
    if (!socket) {
        let token = localStorage.getItem("accessToken");
        // if (!token) {
        //     token = await getAccessToken(); // Fetch a new access token if needed

        //     if (token) {
        //         localStorage.setItem("accessToken", token);
        //     }
        // }
        try {
            socket = io("http://localhost:6969", {
                auth: { token },
                withCredentials: true,
                transports: ["websocket"],
            });
            console.log("Socket initialized:", socket);

            socket.on("connect", () => {
                console.log("Connected to WebSocket ✅ Socket ID:", socket?.id);
            });

            socket.on("disconnect", () => {
                console.log("Disconnected ❌");
            });

            socket.on("connect_error", async (error) => {
                console.error("Socket connection error:", error);
                const newToken = await getAccessToken();
                if (newToken) {
                    window.location.reload();
                }
                else {
                    console.error("Failed to refresh access token. Logging out...");
                    window.location.href = "/Login";
                }
            });
        } catch (error) {
            console.error("Error initializing socket:", error);
            return "INIT_ERROR";
        }
    }
    return socket;
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// async function getAccessToken(): Promise<string | null> {
//     try {
//         const response = await fetch("http://localhost:6969/api/auth/refresh-token", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch access token");
//         }

//         const data = await response.json();
//         return data.token;
//     } catch (error) {
//         console.error("Error fetching access token:", error);
//         return null;
//     }
// }