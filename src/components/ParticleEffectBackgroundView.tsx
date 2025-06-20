import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  originalY: number; // Used for market trend influence
  originalVY: number; // Store initial y-velocity for trend reset
}

interface ParticleEffectBackgroundViewProps {
  className?: string;
  particleCount?: number;
  baseColor?: string;
  particleSizeMin?: number;
  particleSizeMax?: number;
  particleSpeed?: number;
  marketTrend?: 'up' | 'down' | 'neutral';
  mouseInteractionRadius?: number;
  mouseRepelStrength?: number;
  trendInfluenceStrength?: number;
}

const ParticleEffectBackgroundView: React.FC<ParticleEffectBackgroundViewProps> = ({
  className = '',
  particleCount = 100,
  baseColor = 'rgba(200, 200, 200, 0.6)',
  particleSizeMin = 1,
  particleSizeMax = 3,
  particleSpeed = 0.5,
  marketTrend = 'neutral',
  mouseInteractionRadius = 100,
  mouseRepelStrength = 0.5,
  trendInfluenceStrength = 0.1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const initParticles = useCallback(() => {
    console.log('ParticleEffectBackgroundView: Initializing particles');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * (particleSizeMax - particleSizeMin) + particleSizeMin;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const angle = Math.random() * Math.PI * 2;
      const speedFactor = (Math.random() * 0.5 + 0.5) * particleSpeed; // Randomize speed a bit
      const vx = Math.cos(angle) * speedFactor;
      const vy = Math.sin(angle) * speedFactor;

      newParticles.push({
        x,
        y,
        vx,
        vy,
        size,
        color: baseColor,
        originalY: y,
        originalVY: vy,
      });
    }
    particlesRef.current = newParticles;
  }, [particleCount, particleSizeMin, particleSizeMax, particleSpeed, baseColor, dimensions.width, dimensions.height]);

  useEffect(() => {
    console.log('ParticleEffectBackgroundView loaded');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
      // Re-initialize particles on resize to fit new dimensions
      initParticles(); 
    };

    updateDimensions(); // Initial dimension setup

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(canvas);
    
    // Mouse move listener
    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mousePositionRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);


    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [initParticles]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas) {
      return;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        // Market trend influence
        let trendVY = p.originalVY;
        if (marketTrend === 'up') {
          trendVY -= trendInfluenceStrength;
        } else if (marketTrend === 'down') {
          trendVY += trendInfluenceStrength;
        }
        p.vy = trendVY; // Apply trend to current velocity

        // Mouse interaction
        if (mousePositionRef.current.x !== null && mousePositionRef.current.y !== null) {
          const dx = p.x - mousePositionRef.current.x;
          const dy = p.y - mousePositionRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseInteractionRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseInteractionRadius - distance) / mouseInteractionRadius * mouseRepelStrength;
            p.vx += forceDirectionX * force;
            p.vy += forceDirectionY * force;
          }
        }
        
        // Cap velocity to prevent extreme speeds from mouse interaction
        const maxSpeed = particleSpeed * 2;
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > maxSpeed) {
            p.vx = (p.vx / currentSpeed) * maxSpeed;
            p.vy = (p.vy / currentSpeed) * maxSpeed;
        }


        p.x += p.vx;
        p.y += p.vy;

        // Wall collision
        if (p.x - p.size < 0 || p.x + p.size > canvas.width) {
          p.vx *= -1;
          p.x = Math.max(p.size, Math.min(p.x, canvas.width - p.size)); // Prevent sticking
        }
        if (p.y - p.size < 0 || p.y + p.size > canvas.height) {
          p.vy *= -1;
          p.y = Math.max(p.size, Math.min(p.y, canvas.height - p.size)); // Prevent sticking
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation if dimensions are set
    if (dimensions.width > 0 && dimensions.height > 0) {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
        animate();
    }
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [
    baseColor, 
    marketTrend, 
    mouseInteractionRadius, 
    mouseRepelStrength, 
    particleSpeed, 
    trendInfluenceStrength, 
    dimensions // Re-run animation loop when dimensions change
]);


  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};

export default ParticleEffectBackgroundView;