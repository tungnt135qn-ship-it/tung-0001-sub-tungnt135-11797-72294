import { useEffect, useState } from "react";

interface Trail {
  x: number;
  y: number;
  id: number;
}

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Trail[]>([]);
  const [trailId, setTrailId] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      setPosition({ x: e.clientX, y: e.clientY });

      // Add trail particles every 30ms
      if (currentTime - lastTime > 30) {
        setTrails((prev) => [
          ...prev.slice(-15), // Keep only last 15 trails
          { x: e.clientX, y: e.clientY, id: trailId },
        ]);
        setTrailId((prev) => prev + 1);
        lastTime = currentTime;
      }
    };

    const animate = () => {
      setTrails((prev) => prev.filter((_, index) => index > prev.length - 16));
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trailId]);

  return (
    <>
      {/* Trail particles */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[9999] mix-blend-screen"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: (index / trails.length) * 0.6,
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 0 10px hsl(var(--primary) / 0.8)",
              animation: `fade-out 0.8s ease-out forwards`,
            }}
          />
        </div>
      ))}

      {/* Rocket cursor */}
      <div
        className="fixed pointer-events-none z-[10000] transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-16px, -16px)",
        }}
      >
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 blur-lg opacity-60 bg-gradient-to-br from-primary to-secondary rounded-full" />
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-[0_0_12px_hsl(var(--primary)/0.8)]"
          >
            <defs>
              <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(189 100% 50%)", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "hsl(267 75% 60%)", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* Rocket body */}
            <path
              d="M20 4L24 8L28 12L20 20L12 28L8 24L4 20L12 12L20 4Z"
              fill="url(#rocketGradient)"
            />
            {/* Window */}
            <circle cx="18" cy="14" r="2.5" fill="hsl(189 100% 70%)" opacity="0.8" />
            {/* Flames */}
            <path
              d="M8 24L6 26L4 24L6 22L8 24Z"
              fill="hsl(267 75% 70%)"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
    </>
  );
};
