"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/app/socketStore";

const Arena = () => {
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinArena", { room: "battle-room" });

    socket.on("arenaUpdate", (data) => {
      console.log("🛡 Arena Update:", data);
    });

    return () => {
      socket.off("arenaUpdate");
    };
  }, [socket]);

  return (
    <div>
      <h1>🏟 Arena Room</h1>
      <p>⚔ You have joined the battle!</p>
    </div>
  );
};

export default Arena;
