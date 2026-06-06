"use client";

import { useEffect, useState, useRef } from "react";

interface SecureVideoPlayerProps {
  vdoCipherId: string;
  userEmail: string;
  userIp: string;
}

export function SecureVideoPlayer({ vdoCipherId, userEmail, userIp }: SecureVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' });

  // Anti-Piracy: Disable Right Click and Inspect Element
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Dynamic Watermarking Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 80)}%`,
        left: `${Math.floor(Math.random() * 80)}%`,
      });
    }, 5000); // Move every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      {/* VdoCipher DRM Player Iframe */}
      {/* Note: VdoCipher requires generating an OTP from the backend and passing it here */}
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=dummy_otp&playbackInfo=dummy_playback&player=default`}
        className="w-full h-full border-0"
        allow="encrypted-media"
        allowFullScreen
      ></iframe>

      {/* Dynamic Watermark */}
      <div 
        className="absolute pointer-events-none transition-all duration-1000 ease-in-out text-white/30 font-mono text-sm sm:text-base select-none z-50 bg-black/20 p-2 rounded mix-blend-difference"
        style={{ top: watermarkPos.top, left: watermarkPos.left }}
      >
        <p>{userEmail}</p>
        <p>{userIp}</p>
      </div>

      {/* Overlay to prevent direct interaction with the iframe source if needed (optional depending on VdoCipher config) */}
      <div className="absolute inset-0 pointer-events-none z-40 border border-white/10 rounded-xl"></div>
    </div>
  );
}
