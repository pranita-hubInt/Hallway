'use client';

import React from 'react';

/**
 * Login / Auth Icon matching the user-provided graphic:
 * Navy circular backdrop, orange silhouette avatar, and golden padlock with keyhole.
 */
export default function LoginAuthIcon({
  className = 'w-6 h-6',
  size = 24
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      {/* Deep Navy Circular Background */}
      <circle cx="32" cy="32" r="30" className="fill-[#1E294B] dark:fill-[#0F172A]" />

      {/* Diagonal flat shadow overlay across bottom-right */}
      <path
        d="M 32 16 L 50 34 L 56 42 L 48 58 L 32 62 Z"
        className="fill-[#141C38] dark:fill-[#080D1A] opacity-35"
      />

      {/* User Avatar - Head */}
      <circle cx="32" cy="22" r="8" fill="#F97316" />

      {/* User Avatar - Shoulders / Body */}
      <path
        d="M 17 48 C 17 37 23 33 32 33 C 36 33 39.4 34.2 42 36.3 C 39.5 39.2 38 43 38 47.5 C 38 48.4 38.1 49.2 38.3 50 C 36.3 50.7 34.2 51 32 51 C 25 51 18.5 49.5 17 48 Z"
        fill="#F97316"
      />

      {/* Cast shadow under lock */}
      <path
        d="M 38 46 L 56 64 L 62 50 L 52 36 Z"
        className="fill-[#141C38] dark:fill-[#080D1A] opacity-45"
      />

      {/* Padlock Shackle */}
      <path
        d="M 42 36 V 32 C 42 28.5 44.5 26 48 26 C 51.5 26 54 28.5 54 32 V 36"
        stroke="#E2E8F0"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Padlock Body */}
      <rect
        x="37"
        y="35"
        width="22"
        height="18"
        rx="3.5"
        fill="#F59E0B"
      />

      {/* Padlock Highlights / Dimension */}
      <rect
        x="38.5"
        y="36.5"
        width="9"
        height="15"
        rx="2"
        fill="#FBBF24"
      />

      {/* Padlock Keyhole */}
      <circle cx="48" cy="42.5" r="2" fill="#9A3412" />
      <path
        d="M 47.2 43.5 L 48.8 43.5 L 49.3 48 L 46.7 48 Z"
        fill="#9A3412"
      />
    </svg>
  );
}
