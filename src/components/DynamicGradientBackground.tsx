import React, { useState, useEffect, ReactNode, FC } from 'react';
import { motion, TargetAndTransition, Transition, MotionStyle } from 'framer-motion';

// Define color palettes for different sentiments
// Using vibrant, modern colors suitable for a crypto exchange theme
const positiveColors = { from: "#22c55e", via: "#10b981", to: "#059669" }; // Tailwind green-500, emerald-500, teal-600
const negativeColors = { from: "#ef4444", via: "#e11d48", to: "#be123c" }; // Tailwind red-500, rose-600, rose-700
const neutralColors =  { from: "#1e3a8a", via: "#3b82f6", to: "#60a5fa" }; // Tailwind blue-800, blue-500, blue-400

interface DynamicGradientBackgroundProps {
  /**
   * Determines the color scheme of the gradient.
   * 'positive': Greenish tones
   * 'negative': Reddish tones
   * 'neutral': Default bluish tones
   */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /**
   * Custom CSS class name to apply to the component.
   * Use this for sizing and positioning if the default full-screen behavior is not desired.
   */
  className?: string;
  /**
   * Content to be rendered inside the background component.
   */
  children?: ReactNode;
  /**
   * Enables or disables the continuous, subtle shifting animation of the gradient.
   * Defaults to true.
   */
  continuousAnimation?: boolean;
}

// Extend MotionStyle to include CSS custom properties for type safety.
// This avoids using @ts-ignore for CSS custom properties.
interface ExtendedMotionStyle extends MotionStyle {
  "--color-from"?: string;
  "--color-via"?: string;
  "--color-to"?: string;
}

const DynamicGradientBackground: FC<DynamicGradientBackgroundProps> = ({
  sentiment = 'neutral',
  className = 'fixed inset-0 -z-10', // Default to a full-screen fixed background, behind other content
  children,
  continuousAnimation = true,
}) => {
  const [currentColors, setCurrentColors] = useState(neutralColors);

  useEffect(() => {
    console.log('DynamicGradientBackground loaded. Initial sentiment:', sentiment, 'Continuous animation:', continuousAnimation);
  }, [sentiment, continuousAnimation]);

  useEffect(() => {
    switch (sentiment) {
      case 'positive':
        setCurrentColors(positiveColors);
        break;
      case 'negative':
        setCurrentColors(negativeColors);
        break;
      case 'neutral':
      default:
        setCurrentColors(neutralColors);
        break;
    }
  }, [sentiment]);

  // Base style object for the motion component.
  // It includes CSS custom variables that framer-motion will animate.
  const styleProps: ExtendedMotionStyle = {
    "--color-from": currentColors.from,
    "--color-via": currentColors.via,
    "--color-to": currentColors.to,
    backgroundImage: `linear-gradient(to bottom right, var(--color-from), var(--color-via), var(--color-to))`,
  };

  // Animation targets for framer-motion.
  const animateProps: TargetAndTransition = {
    "--color-from": currentColors.from,
    "--color-via": currentColors.via,
    "--color-to": currentColors.to,
  };
  
  // Transition definitions for framer-motion.
  const transitionProps: Transition = {
    // Default transition for color changes (CSS variables)
    type: "tween",
    duration: 1.5, // Smooth 1.5-second transition for color shifts
    ease: "easeInOut",
  };

  if (continuousAnimation) {
    styleProps.backgroundSize = "200% 200%"; // Gradient must be larger than element for pan to be visible
    animateProps.backgroundPosition = ["0% 0%", "100% 0%", "100% 100%", "0% 100%", "0% 0%"];
    // Specific transition for the backgroundPosition property for continuous animation
    transitionProps.backgroundPosition = {
      duration: 25, // Slow, subtle panning effect
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    };
  } else {
    // If continuous animation is off, ensure background is static.
    styleProps.backgroundSize = "100% 100%"; 
    styleProps.backgroundPosition = "0% 0%"; // Static position
    // Animate to static position if it was previously moving
    animateProps.backgroundPosition = "0% 0%";
    if (transitionProps.backgroundPosition) { // If continuous animation was just turned off
      transitionProps.backgroundPosition = { duration: 0.5, ease: "easeOut" };
    }
  }

  return (
    <motion.div
      className={className}
      style={styleProps as MotionStyle} // Cast to MotionStyle after defining with ExtendedMotionStyle
      animate={animateProps}
      transition={transitionProps}
      initial={false} // Apply `style` directly on mount without an initial animation
    >
      {children}
    </motion.div>
  );
};

export default DynamicGradientBackground;