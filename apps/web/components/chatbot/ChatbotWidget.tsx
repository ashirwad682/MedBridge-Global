"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ChatWindow from "./ChatWindow";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show gentle attention tooltip after 2.5 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
  };

  return (
    <>
      {/* Expansive Medical AI Chat Experience */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsOpen(false)}
      />

      {/* Floating Chatbot Launch Button (Shown when collapsed) */}
      {!isOpen && (
        <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
          {/* Gentle Attention Tooltip */}
          {showTooltip && (
            <div className="mb-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                type="button"
                onClick={toggleOpen}
                className="group relative flex items-center px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#121624]/85 backdrop-blur-xl text-neutral-900 dark:text-white border border-white/80 dark:border-white/15 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.12)] hover:shadow-md hover:border-[#7657ff]/40 transition-all cursor-pointer text-xs font-semibold"
              >
                <span>Ask MedBridge AI</span>
              </button>
            </div>
          )}

          {/* Circular Floating Button with User's AI Logo */}
          <button
            type="button"
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-label="Open MedBridge AI Assistant"
            className="group relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/80 dark:border-white/15 flex items-center justify-center transition-all duration-300 shadow-[0_8px_28px_-4px_rgba(118,87,255,0.4),0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_36px_-4px_rgba(118,87,255,0.55)] hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 p-0.5"
          >
            {/* Soft Luminous Glow Aura */}
            <div className="absolute inset-0 rounded-full bg-[#7657ff]/20 dark:bg-[#7657ff]/30 blur-md group-hover:bg-[#7657ff]/40 transition-all pointer-events-none" />

            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/images/medbridge-ai-logo.webp"
                alt="Open MedBridge AI Assistant"
                width={60}
                height={60}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(147,51,234,0.4)]"
              />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
