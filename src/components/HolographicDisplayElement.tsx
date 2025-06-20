import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { LucideProps } from 'lucide-react'; // For icon prop type
import clsx from 'clsx';

interface HolographicDisplayElementProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<LucideProps>; // Pass the icon component itself e.g. Zap from lucide-react
  imageUrl?: string;
  glowColor?: string; // RGB string, e.g., "0, 220, 255" for cyan
  className?: string;
  children?: React.ReactNode; // Allow passing custom children for more flexibility
}

const HolographicDisplayElement: React.FC<HolographicDisplayElementProps> = ({
  title,
  description,
  icon: IconComponent,
  imageUrl,
  glowColor = "0, 220, 255", // Default to a cyan-like blue
  className,
  children,
}) => {
  console.log('HolographicDisplayElement loaded for:', title);

  const cardRef = React.useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    // Normalize mouse position to be -0.5 to 0.5 relative to card center, then scale for effect
    const xPct = (event.clientX - left) / width - 0.5;
    const yPct = (event.clientY - top) / height - 0.5;

    // Scale factor for rotation intensity, lower is more subtle
    const rotationScaleFactor = 20; 
    mouseX.set(xPct * rotationScaleFactor);
    mouseY.set(yPct * rotationScaleFactor);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Define rotation range based on mouse movement. Max +/- 10 degrees.
  const cardRotateX = useTransform(mouseY, [-10, 10], [10, -10]);
  const cardRotateY = useTransform(mouseX, [-10, 10], [-10, 10]);

  // Dynamic opacity for the main glow based on mouse X position (example)
  // This creates a subtle sweeping effect for the glow intensity
  const glowIntensity = useTransform(mouseX, [-10, 10], [0.4, 0.8]); 
  
  // Sheen effect: position of the light streak
  const sheenTranslateX = useTransform(mouseX, [-10, 10], ["-100%", "100%"]);
  const sheenOpacity = useTransform(mouseY, [-5, 5], [0, 0.3]); // Sheen appears more when card is tilted

  return (
    <motion.div
      ref={cardRef}
      className={clsx(
        "relative rounded-xl shadow-2xl overflow-hidden cursor-pointer",
        "bg-slate-900/70 backdrop-blur-lg border border-slate-700/40",
        "w-full max-w-xs sm:max-w-sm p-6 md:p-8 aspect-[3/4]", // Default aspect ratio
        className
      )}
      style={{
        perspective: "1200px", // Increased perspective for more depth
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }} // Gentle zoom on hover
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Layer 1: Background Glow */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${glowColor}, 0.12) 0%, transparent 65%)`,
          opacity: glowIntensity,
          transition: 'opacity 0.1s linear',
        }}
      />

      {/* Layer 2: Subtle Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-15" // More subtle grid
        style={{
          backgroundImage: `
            linear-gradient(rgba(${glowColor}, 0.07) 1px, transparent 1px),
            linear-gradient(to right, rgba(${glowColor}, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px', // Slightly larger grid
        }}
      />

      {/* Layer 3: Content Layer (tilts with mouse) */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center h-full"
        style={{
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {IconComponent && (
          <motion.div style={{ transform: "translateZ(50px)" }} className="mb-4">
             <IconComponent className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: `rgb(${glowColor})`, filter: `drop-shadow(0 0 8px rgba(${glowColor},0.7))` }} />
          </motion.div>
        )}
        {imageUrl && !IconComponent && ( // Show image if no icon, or adjust logic as needed
           <motion.img
            src={imageUrl}
            alt={title}
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mb-4 shadow-lg border-2"
            style={{ transform: "translateZ(40px)", borderColor: `rgba(${glowColor}, 0.5)` }} 
          />
        )}
        <motion.h3
          className="text-xl sm:text-2xl font-bold text-slate-50 mb-2"
          style={{
            transform: "translateZ(30px)",
            textShadow: `0 0 10px rgba(${glowColor},0.5)`,
          }}
        >
          {title}
        </motion.h3>
        {description && (
          <motion.p
            className="text-xs sm:text-sm text-slate-300/90"
            style={{
              transform: "translateZ(20px)",
            }}
          >
            {description}
          </motion.p>
        )}
        {children && (
            <motion.div className="mt-4" style={{ transform: "translateZ(10px)" }}>
                {children}
            </motion.div>
        )}
      </motion.div>

      {/* Layer 4: Foreground Sheen/Glare Layer */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-xl" // Match parent rounding
      >
        <motion.div
          className="absolute -top-1/4 -left-1/2 w-[200%] h-[150%]" // Wider for full sweep
          style={{
            background: `linear-gradient(
              120deg, /* Adjusted angle */
              transparent 30%,
              rgba(${glowColor}, 0.1) 48%, /* Subtler sheen */
              rgba(${glowColor}, 0.1) 52%,
              transparent 70%
            )`,
            translateX: sheenTranslateX,
            opacity: sheenOpacity, // Sheen opacity tied to tilt
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30}}
        />
      </motion.div>
      
      {/* Layer 5: Border Highlight (subtle) */}
      <motion.div 
        className="absolute inset-0 z-10 rounded-xl border-2 pointer-events-none"
        style={{
          borderColor: `rgba(${glowColor},0.3)`,
          opacity: useTransform(mouseY, [-10,10], [0.2, 0.7]) // Border brightens with tilt
        }}
      />

    </motion.div>
  );
};

export default HolographicDisplayElement;