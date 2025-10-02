"use client";

import type React from "react";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Variants } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MovieData,
  getCurrentYear,
  getDateInfo,
} from "../lib/google-sheets";
import { getMoviesForYear } from "../lib/movie-fetcher";

const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[100px] space-y-4">
    <div className="relative">
      <svg
        className="w-10 h-10 text-primary animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div className="text-sm text-muted-foreground">{message}</div>
  </div>
);

const CountdownTimer = dynamic(() => import("./countdown-timer"), {
  loading: () => <LoadingSpinner message="Loading timer..." />,
  ssr: false,
});

const CalendarGrid = dynamic(() => import("./calendar-grid"), {
  loading: () => <LoadingSpinner message="Loading calendar..." />,
  ssr: false,
});

const HorrorYearSelector = dynamic(() => import("./horror-year-selector"), {
  loading: () => (
    <div className="h-10 w-48 bg-slate-800/50 animate-pulse rounded-md mx-auto"></div>
  ),
  ssr: false,
});

const Card = memo(
  ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card"

const Button = memo(
  ({
    children,
    className = "",
    onClick,
    disabled = false,
    variant = "default",
  }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "default" | "outline";
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline:
        "border border-input hover:bg-gray-900/70 hover:text-accent-foreground",
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} h-10 py-2 px-4 ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, staggerChildren: 0.1, delayChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
};

const loadingVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

const waitingCardVariants: Variants = {
  initial: { scale: 0.9, opacity: 0, rotateX: -15 },
  animate: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", damping: 20, stiffness: 300, duration: 0.8 },
  },
  hover: {
    scale: 1.02,
    rotateX: 5,
    transition: { type: "spring", damping: 25, stiffness: 400 },
  },
};

interface HorrorCalendarProps {
  movies?: string[];
  currentDay?: number;
  year?: string;
  initialYear?: string;
}

export function HorrorCalendar({
  movies: externalMovies,
  currentDay: externalCurrentDay,
  year: externalYear,
  initialYear,
}: HorrorCalendarProps) {
  const router = useRouter();
  const [movieData, setMovieData] = useState<MovieData>({});
  const [currentYear, setCurrentYear] = useState(
    externalYear || initialYear || getCurrentYear()
  );
  const [loading, setLoading] = useState(!externalMovies);
  const [dateInfo, setDateInfo] = useState(
    externalCurrentDay
      ? { ...getDateInfo(), currentDay: externalCurrentDay }
      : getDateInfo()
  );

  const navigateToYear = useCallback(
    (year: string) => {
      const currentYearStr = getCurrentYear();
      router.push(year === currentYearStr ? "/" : `/${year}`);
    },
    [router]
  );

  useEffect(() => {
    if (initialYear) setCurrentYear(initialYear);
  }, [initialYear]);

  useEffect(() => {
    const interval = setInterval(() => setDateInfo(getDateInfo()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  if (externalMovies && externalYear) {
    setMovieData((prev) => ({ ...prev, [externalYear]: externalMovies }));
    setLoading(false);
    return;
  }

  let isMounted = true;
  async function fetchMovies() {
    setLoading(true);
    try {
      const movies = await getMoviesForYear(currentYear);
      if (movies && isMounted) {
        setMovieData((prev) => ({ ...prev, [currentYear]: movies }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted) setLoading(false);
    }
  }

  fetchMovies();
  return () => {
    isMounted = false;
  };
}, [externalMovies, externalYear, currentYear]);

  const renderLoadingState = useMemo(() => {
    if (!loading) return null;
    return (
      <motion.div
        variants={loadingVariants}
        initial="initial"
        animate={["animate", "pulse"]}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{
              rotate: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            className="text-6xl mb-4"
          >
            <svg
              className="w-16 h-16 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
            </svg>
          </motion.div>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              animate={{
                x: [0, Math.cos((i * 90 * Math.PI) / 180) * 40],
                y: [0, Math.sin((i * 90 * Math.PI) / 180) * 40],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-2xl text-muted-foreground font-creepster"
        >
          Summoning {currentYear} horror collection...
        </motion.div>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }, [loading, currentYear]);

  if (loading) return renderLoadingState;

  if (!dateInfo.isOctober && currentYear === getCurrentYear()) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.div variants={waitingCardVariants} whileHover="hover">
          <Card className="p-12 bg-card border-border max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute -top-1 left-0 right-0 pointer-events-none overflow-visible z-20">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`main-drip-${i}`}
                  className="absolute bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-full shadow-lg"
                  style={{
                    left: `${5 + i * 6}%`,
                    top: 0,
                    width: `${2 + Math.random() * 3}px`,
                  }}
                  animate={{
                    height: [
                      `0px`,
                      `${20 + Math.random() * 30}px`,
                      `${35 + Math.random() * 40}px`,
                    ],
                    opacity: [0, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 6,
                    ease: "easeOut",
                  }}
                />
              ))}

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`main-falling-drop-${i}`}
                  className="absolute w-4 h-5 bg-red-600 rounded-full shadow-md opacity-80"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: 0,
                  }}
                  animate={{
                    y: [0, 120, 180],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 7,
                    ease: "easeIn",
                  }}
                />
              ))}

              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`main-splatter-${i}`}
                  className="absolute w-2 h-2 bg-red-700 rounded-full"
                  style={{
                    left: `${8 + i * 8}%`,
                    top: `-3px`,
                  }}
                  animate={{
                    scale: [0, 2, 1],
                    opacity: [0, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 4,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div variants={itemVariants} className="mb-8 relative z-10">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="mb-4 flex justify-center"
              >
                <svg
                  className="w-20 h-20 text-orange-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-4xl font-bold text-foreground mb-4 font-creepster"
              >
                The Horror Awaits...
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-xl text-muted-foreground mb-8"
              >
                October {currentYear}&apos;s spine-chilling collection will be
                revealed soon
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <CountdownTimer />
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const availableYears = Object.keys(movieData).sort(
    (a, b) => Number(b) - Number(a)
  );
  const currentYearIndex = availableYears.indexOf(currentYear);
  const prevYear =
    currentYearIndex < availableYears.length - 1
      ? availableYears[currentYearIndex + 1]
      : null;
  const nextYear =
    currentYearIndex > 0 ? availableYears[currentYearIndex - 1] : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentYear}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center ">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => prevYear && navigateToYear(prevYear)}
              disabled={!prevYear}
            >
              ← {prevYear || "----"}
            </Button>
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-foreground font-creepster"
            >
              October {currentYear}
            </motion.h2>
            <Button
              variant="outline"
              onClick={() => nextYear && navigateToYear(nextYear)}
              disabled={!nextYear}
            >
              {nextYear || "----"} →
            </Button>
          </div>
          <div className="flex w-full items-center justify-center flex-col">
            <button
              onClick={() => router.push("/")}
              className="group relative px-3 py-2 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-800/30 rounded-lg text-red-400 font-mono text-sm hover:from-red-800/30 hover:to-red-700/30 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
                Back
              </span>
            </button>
            <div className="w-5 h-5 py-6 px-5"></div>
            <HorrorYearSelector
              availableYears={availableYears}
              currentYear={currentYear}
              onYearSelect={navigateToYear}
              getCurrentYear={getCurrentYear}
            />
          </div>
        </motion.div>

        <CalendarGrid
          movies={movieData[currentYear] || []}
          currentDay={dateInfo.currentDay}
          year={currentYear}
        />
      </motion.div>
    </AnimatePresence>
  );
}
