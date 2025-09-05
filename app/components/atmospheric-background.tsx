"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion } from "framer-motion";


interface BackgroundElementProps {
  id: number;
  emoji: string;
  left: string;
  top: string;
  xOffset: number;
  duration: number;
  delay: number;
}

const BackgroundElement = memo(({ element }: { element: BackgroundElementProps }) => (
  <motion.div
    className="absolute text-2xl opacity-10"
    animate={{
      y: [0, -80, 0],
      x: [0, element.xOffset, 0],
      opacity: [0.05, 0.15, 0.05],
    }}
    transition={{
      duration: element.duration,
      repeat: Number.POSITIVE_INFINITY,
      delay: element.delay,
      ease: "easeInOut",
    }}
    style={{
      left: element.left,
      top: element.top,
    }}
  >
    {element.emoji}
  </motion.div>
));

function AtmosphericBackground() {
  const [mounted, setMounted] = useState(false);

  
  const emojis = useMemo(() => ["🦇", "🕷️", "👻", "💀", "🕸️"], []);

  
  const elements = useMemo(() => {
    const getRandomForIndex = (index: number, max: number) => {
      return ((index * 9301 + 49297) % 233280) / 233280 * max;
    };

    return [...Array(5)].map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(getRandomForIndex(i, emojis.length))],
      left: `${getRandomForIndex(i + 1, 100)}%`,
      top: `${100 + getRandomForIndex(i + 2, 20)}%`,
      xOffset: Math.sin(i) * 50,
      duration: 15 + getRandomForIndex(i + 3, 10),
      delay: getRandomForIndex(i + 4, 10),
    }));
  }, [emojis]);

  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  
  const gradientElements = useMemo(() => (
    <>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/20 via-transparent to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2], scaleY: [0.8, 1.2, 0.8] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </>
  ), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((el) => (
        <BackgroundElement key={el.id} element={el} />
      ))}

      {gradientElements}
    </div>
  );
}

BackgroundElement.displayName = "BackgroundElement"

export default memo(AtmosphericBackground);
