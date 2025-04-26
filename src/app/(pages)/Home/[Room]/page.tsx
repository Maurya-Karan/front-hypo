"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { connectSocket, disconnectSocket } from "@/app/socketStore";
import { io, Socket } from "socket.io-client";
import {redirect} from "next/navigation";
import { getAccessToken } from "../../../../../action";

export default function RoomPage() {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [roomID, setRoomID] = useState<string>("");
    const [socketID, setSocketID] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [msg, setMsg] = useState<string>("");
    const [players, setPlayers] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<
        { sender: string; message: string }[]
    >([]);
    const [newMessage, setNewMessage] = useState<string>("");
    //const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        const user =
            typeof window !== "undefined" ? localStorage.getItem("user_email") : null;
        setUsername(user || "");
    }, []);
    useEffect(() => {
        const path = window.location.pathname;
        const identifier = path.split("/Home/")[1];
        const roomId = identifier.substring(0, 6); //
        const socketId = searchParams.get("socketId") || "";

        setRoomID(roomId);
        setSocketID(socketId);

        sessionStorage.setItem("roomID", roomId);
        sessionStorage.setItem("socketID", socketId);

        const initializeSocket = async () => {
            const skt = await connectSocket();
            if (skt && typeof skt !== "string") {
                setSocket(skt as Socket);
            }
        };

        initializeSocket();

        return () => {
            disconnectSocket();
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() !== "" && socket) {
            socket.emit("sendMessage", { roomID, sender: username, message: newMessage });
            setNewMessage("");
        }
    };
    const handleReceiveMessage = (data: { sender: string; message: string }) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
    };

    const getMessages = () => {
        socket?.emit("getMessages", { roomID });
    };

    const handleAuthError = async ({ err }: { err: string }) => {
       // console.error("Authentication error:", err);
        const token = await getAccessToken();
        if (!token) {
            alert("Please Login to get started");
            redirect("/Login");
            return;
        }
        localStorage.setItem("accessToken", token);

    }

    useEffect(() => {
        if (!socket) return;

        // Emit the "joinRoom" event
        socket.emit("joinRoom", { username, roomID });
        getMessages();
        // Listen for "roomJoined" and "roomNotFound" events
        const handleRoomJoined = ({
            messg,
            roomID,
        }: {
            roomID: string;
            messg: string;
        }) => {
            console.log("Joined room:", messg);
            setMsg(messg);
        };

        const handleRoomNotFound = () => {
            alert("Room not found!");
        };
        const handleUserJoined = ({ players }: { players: string[] }) => {
            console.log("Players in the room:", players);
            const newPlayers = setPlayers(players); // Update the players state
        };

        const handleUserLeft = ({ players }: { players: string[] }) => {
            console.log("Players in the room:", players);
            const newPlayers = players.filter((player) => player !== username); // Remove the user who left
            setPlayers(newPlayers); // Update the players state
        };

        const handleGetMessages = ({ messages }: { messages: any }) => {
            if (messages) {
                setChatMessages(messages);
            }
        };

        socket.on("messages", handleGetMessages);

        socket.on("userLeft", handleUserLeft);
        socket.on("roomJoined", handleRoomJoined);
        socket.on("roomNotFound", handleRoomNotFound);
        socket.on("userJoined", handleUserJoined);
        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("authError", handleAuthError);
        return () => {
            socket.off("roomJoined", handleRoomJoined);
            socket.off("roomNotFound", handleRoomNotFound);
            socket.off("userJoined", handleUserJoined);
            socket.off("userLeft", handleUserLeft);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messages", handleGetMessages);
            socket.off("authError", handleAuthError);
        };
    }, [socket, username, roomID]); // Add dependencies here

    return (
        <div>
            <h1>Room ID: {roomID}</h1>
            <h2>Socket ID: {socketID}</h2>
            <p>Socket Connection ID: {socket?.id || "Connecting..."}</p>
            <p>{msg}</p>
            <ol>
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ol>
            <div
                style={{ border: "1px solid gray", padding: "10px", marginTop: "20px" }}
            >
                <h3>Room Chat</h3>
                <div
                    style={{
                        maxHeight: "200px",
                        overflowY: "scroll",
                        marginBottom: "10px",
                        border: "1px solid black",
                        padding: "5px",
                    }}
                >
                    {chatMessages &&
                        chatMessages.map((msg, index) => (
                            <p key={index}>
                                <strong className="text-black">{msg.sender}:</strong>{" "}
                                {msg.message}
                            </p>
                        ))}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ width: "70%", marginRight: "10px" }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}