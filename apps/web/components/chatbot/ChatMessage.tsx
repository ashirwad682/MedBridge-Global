"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatMessageData } from "@/app/api/chat/route";
import { useBooking } from "@/components/booking/BookingContext";
import {
  Calendar,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageData;
  onSuggestionClick?: (text: string) => void;
  onRegenerate?: () => void;
}

export default function ChatMessage({
  message,
  onSuggestionClick,
  onRegenerate,
}: ChatMessageProps) {
  const { openBooking } = useBooking();
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe formatting for bold (**text**), bullet items (• item), inline code (`code`)
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split("\n");

    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={pIdx}
              className="px-1.5 py-0.5 rounded bg-white/60 dark:bg-white/10 font-mono text-[11px] text-neutral-900 dark:text-neutral-100 font-semibold border border-white/80 dark:border-white/15"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-neutral-400 select-none">•</span>
            <span className="flex-1">{parsedLine}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div
      className={`group flex items-start gap-2.5 my-3 animate-in fade-in duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Small Assistant Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-0.5">
          {message.isEmergencyAlert ? (
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full overflow-hidden shadow-2xs flex items-center justify-center bg-[#0a0a0a]">
              <Image
                src="/images/medbridge-ai-logo.webp"
                alt="MedBridge AI"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%]`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed transition-all shadow-2xs ${
            isUser
              ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-neutral-950 rounded-tr-xs shadow-xs"
              : message.isEmergencyAlert
              ? "bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-200 border border-red-200/80 dark:border-red-800/40 rounded-tl-xs"
              : "bg-white/70 dark:bg-white/[0.08] backdrop-blur-md text-neutral-900 dark:text-neutral-100 border border-white/80 dark:border-white/12 rounded-tl-xs shadow-2xs"
          }`}
        >
          {renderFormattedText(message.text)}
        </div>

        {/* Action Buttons within Bot Messages */}
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {message.actions.map((act, i) => {
              if (act.type === "booking") {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      openBooking(
                        act.specialtyId ? { specialtyId: act.specialtyId } : undefined
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white text-[11px] font-semibold tracking-wide transition-all shadow-xs hover:shadow active:scale-[0.98] cursor-pointer"
                  >
                    <Calendar className="w-3 h-3 text-neutral-300" />
                    <span>{act.label}</span>
                  </button>
                );
              }

              if (act.type === "link" && act.href) {
                return (
                  <Link
                    key={i}
                    href={act.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-[11px] font-semibold transition-all shadow-2xs hover:border-neutral-300"
                  >
                    <span>{act.label}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </Link>
                );
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSuggestionClick && onSuggestionClick(act.label)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Unobtrusive Footer: Timestamp + Copy & Regenerate Actions */}
        {!isUser ? (
          <div className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9.5px] text-neutral-400">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className="text-neutral-400 hover:text-black p-0.5 rounded transition-colors"
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="text-neutral-400 hover:text-black p-0.5 rounded transition-colors"
                title="Regenerate response"
                aria-label="Regenerate response"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-[9.5px] text-neutral-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
