import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Assumes cn utility is available from shadcn/ui setup

interface GlassmorphismTradingCardProps {
  /** The content to be displayed inside the card. */
  children: ReactNode;
  /** Additional CSS classes to apply to the card for custom styling. */
  className?: string;
  /** Controls the padding inside the card. Defaults to 'p-6'. */
  padding?: 'p-3' | 'p-4' | 'p-6' | 'p-8' | 'none';
}

/**
 * A custom card component utilizing semi-transparent backgrounds with blur (glassmorphism effect),
 * rounded corners, and subtle borders. Designed for displaying trading pairs, portfolio items,
 * or feature highlights with clearly legible content.
 */
const GlassmorphismTradingCard: React.FC<GlassmorphismTradingCardProps> = ({
  children,
  className,
  padding = 'p-6', // Default padding, common for cards
}) => {
  console.log('GlassmorphismTradingCard component loaded');

  const paddingClass = {
    'p-3': 'p-3',
    'p-4': 'p-4',
    'p-6': 'p-6',
    'p-8': 'p-8',
    'none': '',
  }[padding];

  return (
    <div
      className={cn(
        // Core glassmorphism styles
        'bg-black/25 backdrop-blur-lg', // Semi-transparent dark background with significant blur
                                        // Adjusted opacity to /25 for a slightly more solid feel but still glassy
        // Border and shape
        'rounded-2xl',                  // Modern, slightly larger rounded corners suitable for mobile
        'border border-white/10',       // Very subtle white border to catch light on dark themes
        
        // Depth and appearance
        'shadow-xl',                    // Pronounced shadow for a floating effect

        // Content related
        paddingClass,                   // Dynamic padding based on prop
        'text-neutral-100',             // Default text color for high contrast and legibility
                                        // (assuming a generally darker or vibrant background)
        className                       // Allows for additional custom Tailwind classes
      )}
    >
      {children}
    </div>
  );
};

export default GlassmorphismTradingCard;