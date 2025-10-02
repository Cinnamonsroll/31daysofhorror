"use client";

import type React from "react";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Lock, Play } from "lucide-react";
import { MovieModal } from "./movie-modal";
import { MovieInfo } from "../lib/movie-fetcher";


const Card = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);


const HorrorIcon = memo(
  ({ type, className = "w-6 h-6" }: { type: string; className?: string }) => {
    const icons = {
      skull: (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      ),
      ghost: (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.69 2 6 4.69 6 8v8l2-2 2 2 2-2 2 2 2-2 2 2V8c0-3.31-2.69-6-6-6zm-2 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      ),
    };

    const keys = Object.keys(icons);
    const iconType = keys[
      Math.abs(type.charCodeAt(0)) % keys.length
    ] as keyof typeof icons;
    return icons[iconType];
  }
);

HorrorIcon.displayName = "HorrorIcon"

const BloodDrip = memo(({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute top-0 left-1/2 w-1 bg-gradient-to-b from-red-600 to-red-800 rounded-full"
    initial={{ height: 0, y: -10 }}
    animate={{ height: 20, y: 0 }}
    transition={{ delay, duration: 1.5, ease: "easeOut" }}
  />
));

BloodDrip.displayName = "BloodDrip"

const doorVariants = {
  closed: { rotateY: 0 },
  opening: { rotateY: -90 },
  open: { rotateY: -180 },
};

interface CalendarGridProps {
  movies: string[];
  currentDay: number;
  year: string;
}

export default memo(function CalendarGrid({
  movies,
  currentDay,
  year,
}: CalendarGridProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [revealedDays, setRevealedDays] = useState<Set<number>>(new Set());
  const [openingDays, setOpeningDays] = useState<Set<number>>(new Set());
  const [rotations] = useState(() => Array.from({ length: 31 }, () => Math.random() * 50 - 17));


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const isPastYear = Number.parseInt(year) < currentYear;

    if (isPastYear) {
      setRevealedDays(new Set(Array.from({ length: 31 }, (_, i) => i + 1)));
    } else if (Number.parseInt(year) === currentYear) {
      const pastDays = Array.from(
        { length: Math.max(0, currentDay - 1) },
        (_, i) => i + 1
      );
      setRevealedDays(new Set(pastDays));
    }
  }, [year, currentDay]);

  const handleDayClick = (day: number) => {
    const currentYear = new Date().getFullYear();
    const isPastYear = Number.parseInt(year) < currentYear;
    const canReveal = day <= currentDay || isPastYear;

    if (canReveal) {
      if (!revealedDays.has(day)) {
        setOpeningDays((prev) => new Set([...prev, day]));
        setTimeout(() => {
          setRevealedDays((prev) => new Set([...prev, day]));
          setOpeningDays((prev) => {
            const newSet = new Set(prev);
            newSet.delete(day);
            return newSet;
          });
          if (day === currentDay && Number.parseInt(year) === currentYear) {
            setSelectedDay(day);
          }
        }, 800);
      } else {
        setSelectedDay(day);
      }
    }
  };

  const getDayStatus = (day: number) => {
    const currentYear = new Date().getFullYear();
    const isPastYear = Number.parseInt(year) < currentYear;
    if (isPastYear) return "available";
    if (day < currentDay) return "past";
    if (day === currentDay) return "current";
    return "future";
  };

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto px-2">
        {Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const status = getDayStatus(day);
          const isRevealed = revealedDays.has(day);
          const isOpening = openingDays.has(day);

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.6 }}
              whileHover={{
                scale: status !== "future" ? 1.05 : 1,
                rotateX: status !== "future" ? 5 : 0,
              }}
              whileTap={{ scale: status !== "future" ? 0.95 : 1 }}
              className="perspective-1000"
            >
              <div className="relative preserve-3d">
                {isRevealed && status !== "future" && (
                  <BloodDrip delay={i * 0.1} />
                )}

                <motion.div
                  variants={doorVariants}
                  animate={
                    isOpening ? "opening" : isRevealed ? "open" : "closed"
                  }
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="preserve-3d"
                >
                  <Card
                    className={`
                      aspect-square p-2 sm:p-3 cursor-pointer relative overflow-hidden
                      transition-all duration-300 border-2 backface-hidden
                      ${
                        status === "future"
                          ? "bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 cursor-not-allowed"
                          : status === "current"
                          ? "bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-600 shadow-lg shadow-red-600/30"
                          : "bg-gradient-to-br from-slate-800/60 to-slate-700/40 border-slate-600 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
                      }
                      ${isRevealed ? "invisible" : "visible"}
                    `}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
                      <motion.div
                        className={`text-base sm:text-lg md:text-xl font-bold mb-1 font-creepster ${
                          status === "current"
                            ? "text-red-400"
                            : "text-slate-200"
                        }`}
                        animate={
                          status === "current"
                            ? {
                                textShadow: [
                                  "0 0 5px #ef4444",
                                  "0 0 15px #dc2626",
                                  "0 0 5px #ef4444",
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {day}
                      </motion.div>
                      <HorrorIcon
                        type={day.toString()}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 opacity-70"
                      />
                      {status === "future" && (
                        <motion.div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                        </motion.div>
                      )}
                    </div>
                  </Card>

                  <Card
                    className={`
                      aspect-square p-2 sm:p-3 absolute inset-0 backface-hidden rotate-y-180
                      bg-gradient-to-br from-red-900/30 to-slate-900/50 border-2 border-red-600
                      shadow-lg shadow-red-600/30 cursor-pointer overflow-hidden
                    `}
                    onClick={() => setSelectedDay(day)}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <motion.div
                        className={`absolute top-2 left-3 text-base sm:text-lg md:text-xl font-bold mb-1 font-creepster ${
                          status === "current"
                            ? "text-red-400"
                            : "text-slate-200"
                        }`}
                        animate={
                          status === "current"
                            ? {
                                textShadow: [
                                  "0 0 5px #ef4444",
                                  "0 0 15px #dc2626",
                                  "0 0 5px #ef4444",
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ rotate: `${rotations[day - 1]}deg` }}

                      >
                        {day}
                      </motion.div>
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mb-1" />
                      <div className="text-xs text-slate-200 px-1 font-bold">
                        {movies[day - 1] || "Loading..."}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <MovieModal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        movieTitle={selectedDay !== null ? movies[selectedDay - 1] : null}
      />
    </>
  );
});
