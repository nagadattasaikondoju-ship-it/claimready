import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const pixelSize = size === 'sm' ? 26 : size === 'lg' ? 36 : 30;

  const textSizes = {
    sm: 'text-[17px]',
    md: 'text-[19px]',
    lg: 'text-[22px]',
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Constrained Vector SVG Icon */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: pixelSize,
          height: pixelSize,
          minWidth: pixelSize,
          minHeight: pixelSize,
          maxWidth: pixelSize,
          maxHeight: pixelSize,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={pixelSize}
          height={pixelSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Blue Document Sheet */}
          <path
            d="M18 10C18 6.68629 20.6863 4 24 4H66C69.3137 4 72 6.68629 72 10V26L86 40V86C86 89.3137 83.3137 92 80 92H24C20.6863 92 18 89.3137 18 86V10Z"
            fill="#1E4FA8"
          />
          {/* White Clause Text Lines */}
          <rect x="30" y="22" width="34" height="6" rx="3" fill="white" />
          <rect x="30" y="34" width="24" height="6" rx="3" fill="white" />

          {/* Green Pulse Wave Line */}
          <path
            d="M8 64H24L30 50L38 74L44 60L50 64H62"
            stroke="#22B573"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Green Verified Checkmark */}
          <circle cx="72" cy="72" r="20" fill="#22B573" />
          <path
            d="M63 72L69 78L81 65"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className={`font-bold tracking-tight ${textSizes[size]} leading-none flex items-center`}>
        <span className="text-[#1E4FA8]">Claim</span>
        <span className="text-[#22B573]">Ready</span>
      </div>
    </div>
  );
}
