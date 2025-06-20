import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedNumericDisplayProps {
  /** The target numeric value to display and animate to. */
  value: number;
  /** Duration of the animation in seconds. Defaults to 0.5. */
  duration?: number;
  /** Number of decimal places to display. Defaults to 2. */
  precision?: number;
  /** Optional CSS class names for styling. */
  className?: string;
  /** Optional prefix string (e.g., "$", "BTC "). */
  prefix?: string;
  /** Optional suffix string (e.g., "%", " USDT"). */
  suffix?: string;
}

const AnimatedNumericDisplay: React.FC<AnimatedNumericDisplayProps> = ({
  value,
  duration = 0.5,
  precision = 2,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  // motionValue stores the current animated numeric value.
  // Initialized with the initial `value` prop.
  const motionValue = useMotionValue(value);

  // useTransform creates a new MotionValue that transforms the output of another.
  // Here, it formats the number (toFixed, prefix, suffix).
  const transformedDisplayValue = useTransform(motionValue, (currentValue) => {
    // Ensure `currentValue` is treated as a number for `toFixed`
    const numValue = Number(currentValue);
    if (isNaN(numValue)) {
      // Handle cases where currentValue might not be a number, though animate should provide numbers.
      return `${prefix}0${suffix}`; // Or some other fallback
    }
    return `${prefix}${numValue.toFixed(precision)}${suffix}`;
  });

  useEffect(() => {
    console.log('AnimatedNumericDisplay loaded');
  }, []);

  useEffect(() => {
    // This effect triggers when the `value` prop (or other animation params) changes.
    // It starts an animation to update `motionValue` from its current state to the new `value`.
    const controls = animate(motionValue, value, {
      duration: duration,
      ease: 'easeOut', // Smooth deceleration
    });

    // Return a cleanup function to stop the animation if the component unmounts
    // or if dependencies change again before completion.
    return controls.stop;
  }, [value, duration, motionValue, precision, prefix, suffix]); 
  // `precision`, `prefix`, `suffix` are included in deps because if they change, 
  // `transformedDisplayValue` needs to re-evaluate its formatting logic,
  // even if `motionValue` itself is not re-animated, its display representation changes.
  // However, `transformedDisplayValue` recomputes automatically when its source `motionValue` or its transform function's captured variables change.
  // The `animate` call specifically targets `value` and `duration`.
  // Let's refine dependencies for the animate effect to only what drives the animation itself.
  // The `transformedDisplayValue` will update due to its own definition when prefix/suffix/precision change.

  // Revised effect for animation:
  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: duration,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value, duration, motionValue]);


  // If prefix, suffix, or precision change, we need to ensure the displayed value updates
  // even if the number itself (`value`) hasn't changed.
  // `useTransform` handles this: if `prefix`, `suffix`, or `precision` are changed such that
  // the component re-renders, `useTransform` will use the new values in its transform function.
  // So, the `transformedDisplayValue` will correctly reflect these changes.
  // No separate effect is strictly needed for just prefix/suffix/precision changes if `useTransform` is correctly set up.

  return (
    <motion.span className={className}>
      {transformedDisplayValue}
    </motion.span>
  );
};

export default AnimatedNumericDisplay;