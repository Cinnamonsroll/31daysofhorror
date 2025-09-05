"use client"
import type { Variants } from "framer-motion"
import { useEffect, useState, useCallback, useMemo, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { scale: 0, rotateY: -90 },
  visible: {
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
    },
  },
}

const numberVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

const TimeUnit = memo(({ unit, value }: { unit: string; value: number }) => {
  return (
    <motion.div variants={cardVariants} className="text-center relative">
      <motion.div
        className="bg-primary text-primary-foreground rounded-lg p-4 mb-2 relative overflow-hidden"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 20px rgba(234, 88, 12, 0.5)",
        }}
      >
        <div className="absolute top-0 right-2 w-3 h-4 bg-red-800/40 rounded-full blur-sm" />
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-red-700/30 rounded-full" />
        
        <div className="relative z-10 h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-3xl md:text-4xl font-bold font-mono"
            >
              {value.toString().padStart(2, "0")}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {unit}
      </div>
    </motion.div>
  );
});

TimeUnit.displayName = "TimeUnit"

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const calculateTimeLeft = useCallback(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const october1 = new Date(currentYear, 9, 1)

    if (now > october1) {
      october1.setFullYear(currentYear + 1)
    }

    const difference = october1.getTime() - now.getTime()

    if (difference > 0) {
      const newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }

      setTimeLeft(newTimeLeft)
    }
  }, [])

  useEffect(() => {
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  
  const timeUnits = useMemo(() => {
    return Object.entries(timeLeft).map(([unit, value]) => (
      <TimeUnit key={unit} unit={unit} value={value} />
    ));
  }, [timeLeft]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-4 max-w-md mx-auto relative"
    >
      {timeUnits}
    </motion.div>
  );
}

export default memo(CountdownTimer);
