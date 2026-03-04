'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const GRID_SIZE = 25;

export function CuadriculaReactiva() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = {
    x: useMotionValue(Infinity),
    y: useMotionValue(Infinity),
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        if (containerRef.current) {
          const { left, top } = containerRef.current.getBoundingClientRect();
          mouse.x.set(e.clientX - left);
          mouse.y.set(e.clientY - top);
        }
      }}
      onMouseLeave={() => {
        mouse.x.set(Infinity);
        mouse.y.set(Infinity);
      }}
      className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-background border"
    >
      <div className="relative z-10 grid h-full w-full" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <Cell key={i} mouse={mouse} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-headline text-primary text-glow">Cuadrícula Reactiva</h2>
        <p className="text-muted-foreground mt-2">Mueve el ratón para interactuar</p>
      </div>
    </div>
  );
}

function Cell({ mouse }: { mouse: { x: any, y: any } }) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(() => {
    if (mouse.x.get() === Infinity || !ref.current) {
      return Infinity;
    }
    const { x, y, width, height } = ref.current.getBoundingClientRect();
    const bodyX = x + width / 2;
    const bodyY = y + height / 2;
    
    const containerRect = ref.current.parentElement!.parentElement!.getBoundingClientRect();
    const mouseX = mouse.x.get() + containerRect.left;
    const mouseY = mouse.y.get() + containerRect.top;

    return Math.hypot(bodyX - mouseX, bodyY - mouseY);
  });
  
  const opacity = useTransform(distance, [0, 200], [1, 0]);
  const springOpacity = useSpring(opacity, { mass: 0.1, stiffness: 200, damping: 25 });
  
  const scale = useTransform(distance, [0, 150], [1, 0.5]);
  const springScale = useSpring(scale, { mass: 0.1, stiffness: 200, damping: 25 });

  return (
    <motion.div
      ref={ref}
      className="border border-primary/10"
      style={{
        backgroundColor: `hsl(var(--primary))`,
        opacity: springOpacity,
        scale: springScale
      }}
    />
  );
}
