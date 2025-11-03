import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// NOTE: Video/canvas components removed per request. This file no longer
// contains code to start/stop or render local camera streams.

// Socket client: prefer pure WebSocket for lower latency
const socket = io("https://miccheck-bot-backend.onrender.com", {
  transports: ["websocket"],
  reconnectionAttempts: 10,
  timeout: 8000,
});

export default function VoiceOverlay() {
  const [members, setMembers] = useState([]);

  const localUserIdRef = useRef("");

  // NOTE: local camera / device selection removed
  // video/publishing removed — keep simple voice-only state

  useEffect(() => {
    const onMembers = (data) => {
      console.log("received voiceMembers:", data);
      setMembers(
        Array.isArray(data)
          ? data.map((m) => ({
              speaking: false,
              hasVideo: false,
              displayName: m.displayName || m.username,
              ...m,
            }))
          : []
      );
    };
    const onSpeaking = ({ id, username, displayName, speaking }) => {
      console.log("received speaking:", {
        id,
        username,
        displayName,
        speaking,
      });
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                speaking,
                username: username ?? m.username,
                displayName: displayName ?? m.displayName ?? m.username,
              }
            : m
        )
      );
    };
    const onConnect = () => {
      console.log("socket connected", socket.id);
      socket.emit("requestSnapshot");
    };
    const onConnectError = (err) => console.error("socket connect_error:", err);
    const onDisconnect = (reason) =>
      console.warn("socket disconnected:", reason);

    socket.on("voiceMembers", onMembers);
    socket.on("speaking", onSpeaking);
    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    // WebRTC publisher/host handlers removed from frontend — backend still
    // retains signaling if needed, but the overlay no longer handles tracks.

    return () => {
      // In dev StrictMode, avoid disconnecting the shared socket; just remove listeners
      socket.off("voiceMembers", onMembers);
      socket.off("speaking", onSpeaking);
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // removed local webcam/effects and publisher auto-start behavior

  return (
    <div className="w-full">
      <ul className="Voice_voiceStates__overlay flex flex-wrap justify-center items-center gap-4 w-full mx-auto py-4 list-none box-border">
        {members.map((m) => {
          const wrapperBase =
            "relative flex flex-col justify-center items-center w-[320px] h-[180px] rounded-xl bg-[#070b10] border-[3px] border-transparent box-border overflow-hidden";
          const wrapperSpeaking =
            "bg-[#0f1f2e] border-[#43b581] shadow-[0_0_25px_rgba(67,181,129,0.5)]";
          const avatarBase =
            "w-20 h-20 rounded-full object-cover brightness-50 select-none";
          const avatarSpeaking = "brightness-100 scale-[1.05]";

          return (
            <li
              key={m.id}
              className={`Voice_voiceState__item ${wrapperBase} ${
                m.speaking ? "wrapper_speaking " + wrapperSpeaking : ""
              }`}
            >
              {/* Avatar */}
              <img
                className={`Voice_avatar__img ${avatarBase} ${
                  m.speaking ? avatarSpeaking : ""
                }`}
                style={{ position: "relative", zIndex: 10 }}
                src={m.avatar}
                alt={m.username}
                draggable={false}
              />

              {/* Name overlay */}
              <div
                style={{
                  position: "relative",
                  marginTop: "18px",
                  zIndex: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "transparent",
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              >
                <span className="Voice_name__text text-white text-[16px] font-medium bg-transparent text-center whitespace-normal break-words px-2 w-full drop-shadow-lg">
                  {m.displayName || m.username}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
