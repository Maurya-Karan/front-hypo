"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import cats from '../../categories';
import { Socket } from 'socket.io-client';
import { connectSocket } from '@/app/socketStore';
import { getAccessToken, handleLogout } from '../../../../action';

const Home = () => {
    const [username, setUsername] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomName, setRoomName] = useState<string>("null");
    const router = useRouter();

    useEffect(() => {
        const initializeSocket = async () => {
            const skt = await connectSocket();
            if (skt && typeof skt !== "string") {
                setSocket(skt as Socket);
            }
        };
        setUsername(typeof window !== "undefined" ? localStorage.getItem("user_email") || "" : "");

        initializeSocket();
    }, [router]);



    useEffect(() => {
        if (!socket) return;

        const handleRoomCreated = ({ roomID }: { roomID: string }) => {
            setRoomId(roomID);
            router.push(`/Home/${roomID}`);
        };

        const handleRoomJoined = ({ messg,roomID }: {messg:string; roomID: string }) => {
            console.log("Room joined:", roomID);
            router.push(`/Home/${roomID}`); 
        };

        const handleAuthError = async ({err}:{err:string}) =>{
            console.error("Authentication error:", err);
            const token = await getAccessToken();
            if (!token) {
                alert("Please Login to get started");
                router.replace("/Login");
                return;
            }
            localStorage.setItem("accessToken",token);
            
        }

        socket.on("authError", handleAuthError);

        socket.on("roomCreated", handleRoomCreated);

        socket.on("roomJoined", handleRoomJoined);

        socket.on("roomNotFound", () => {
            alert("Room not found!");
        });

        return () => {
            socket.off("roomCreated", handleRoomCreated);
            socket.off("roomJoined");
            socket.off("roomNotFound");
            socket.off("authError", handleAuthError);
        };
    }, [socket, router]);

    const createRoom = () => {
        if (!username.trim()) return alert("Enter username first!");
        socket?.emit("createRoom", { username });
    };

    const joinRoom = () => {
        if (!roomId.trim()) return alert("Enter Room ID!");
        const roomID = roomId.trim();
        socket?.emit("joinRoom", { username, roomID });
    };

    return (
        <div className="p-4 gradient-bg">
            <Link href="/Room">Subject</Link>

            <ul>
                {cats.map((cat) => (
                    <li key={cat} onClick={() => setRoomId(cat)} className="cursor-pointer hover:underline">
                        {cat}
                    </li>
                ))}
            </ul>

            <input
                type="text"
                placeholder="Enter username"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="border p-2 rounded mb-2 block"
            />

            <button onClick={createRoom} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Create Room
            </button>

            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border p-2 rounded mb-2 block"
            />

            <button onClick={joinRoom} className="bg-green-500 text-white px-4 py-2 rounded">
                Join Room
            </button>

            <h2 className="mt-4">Socket Connection</h2>
            <p>Socket ID: {socket?.id || "Connecting..."}</p>
            <button title='logout' style={{ backgroundColor: "red" }} onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;