"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HorrorYearSelectorProps {
  availableYears: string[]
  currentYear: string
  onYearSelect: (year: string) => void
  getCurrentYear: () => string
}

export default function HorrorYearSelector({
  availableYears,
  currentYear,
  onYearSelect,
  getCurrentYear,
}: HorrorYearSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative overflow-hidden bg-gradient-to-r from-red-950/40 to-red-900/40 border-2 border-red-800/50 text-red-100 hover:from-red-900/60 hover:to-red-800/60 hover:border-red-700/70 hover:text-white transition-all duration-300 min-w-[140px] px-4 py-2 rounded-lg font-mono"
      >
        {currentYear} {currentYear === getCurrentYear() ? "(Current)" : ""}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-40 bg-gray-900 border border-red-800/50 rounded-lg shadow-lg p-1 z-50"
          >
            {availableYears.map((year) => (
              <div
                key={year}
                onClick={() => {
                  onYearSelect(year)
                  setIsOpen(false)
                }}
                className={`mt-1 text-sm overflow-hidden hover:bg-red-900/40 transition-all text-red-100 flex items-center h-8 gap-2 p-2 rounded-md cursor-pointer font-mono ${
                  year === currentYear ? "bg-red-900/30 text-red-200" : ""
                }`}
              >
                {year}
                {year === getCurrentYear() && <span className="text-xs text-red-300/90">(Current)</span>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
