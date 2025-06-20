import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface LiquidTransitionViewProps {
  children: React.ReactNode;
  animationKey: string | number; // A unique key that changes when the content should transition
  className?: string; // Optional className for the motion.div wrapper
}

const liquidVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    // y: 10, // Subtle upward movement on enter
  },
  animate: {
    opacity: 1,
    scale: 1,
    // y: 0,
    transition: {
      duration: 0.5, // Duration for the "liquid" feel
      ease: [0.42, 0, 0.58, 1], // Custom cubic-bezier for smooth acceleration/deceleration
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    // y: -10, // Subtle downward movement on exit
    transition: {
      duration: 0.4, // Slightly faster exit
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const LiquidTransitionView: React.FC<LiquidTransitionViewProps> = ({
  children,
  animationKey,
  className,
}) => {
  console.log(`LiquidTransitionView loaded, current animationKey: ${animationKey}`);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        variants={liquidVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className} // Allows styling the wrapper, e.g., to fill parent
        style={{ width: '100%', height: '100%' }} // Default to full size, can be overridden by className
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default LiquidTransitionView;