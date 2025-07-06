// /home/project/src/components/ColonaiveLogo.tsx
import React from 'react';

interface ColonaiveLogoProps {
  // Allows external Tailwind classes to be passed for sizing, weight, or base text color
  className?: string;
  // Optional: If the base color needs to be different than white (e.g., for dark mode on a light background)
  baseTextColorClass?: string;
  // Optional: If the accent color needs to be different than teal-400
  accentColorClass?: string;
}

const ColonaiveLogo: React.FC<ColonaiveLogoProps> = ({
  className = '',
  baseTextColorClass = 'text-white', // Default text color for COLON and ™
  accentColorClass = 'text-teal-400' // Default accent color for AiVE
}) => {
  return (
    // The outer span carries the base text color, font weight, tracking, and any passed-in className (e.g., for font size)
    <span className={`${baseTextColorClass} font-bold tracking-tight ${className}`}>
      COLON
      {/* The inner span overrides the text color for 'AiVE' */}
      <span className={`${accentColorClass}`}>AiVE</span>™
    </span>
  );
};

export default ColonaiveLogo;
