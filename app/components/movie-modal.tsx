"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { MovieDetailsTemplate } from "./movie-details-template"
import { MovieInfo, getMovieInfo } from "../lib/movie-fetcher"

interface MovieModalProps {
  isOpen: boolean
  onClose: () => void
  movieTitle: string | null
}

export function MovieModal({ isOpen, onClose, movieTitle}: MovieModalProps) {
  const [movieData, setMovieData] = useState<MovieInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  
  useEffect(() => {
    
    if (!isOpen || !movieTitle) {
      setMovieData(null)
      return
    }
    
    
    if (isOpen && movieTitle) {
      const fetchMovieData = async () => {
        setLoading(true)
        try {
          const data = await getMovieInfo(movieTitle)
          setMovieData(data)
        } catch (error) {
          console.error("Error fetching movie data:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchMovieData()
    }
  }, [isOpen, movieTitle])

  
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    
    
    window.addEventListener('resize', checkMobile)
    
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  
  const containerVariants = {
    hidden: isMobile 
      ? { y: "100%", opacity: 1 } 
      : { scale: 0.7, opacity: 0 },
    visible: isMobile 
      ? { y: 0, opacity: 1 } 
      : { scale: 1, opacity: 1 },
    exit: isMobile 
      ? { y: "100%", opacity: 1 } 
      : { scale: 0.7, opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-br from-red-900/30 to-slate-900/50 rounded-t-xl md:rounded-xl p-6 max-w-6xl w-full relative ${isMobile ? 'max-h-[90vh] overflow-y-auto' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors duration-200 z-10"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                <p className="mt-4 text-slate-300">Summoning movie details...</p>
              </div>
            ) : movieData ? (
              <MovieDetailsTemplate movieInfo={movieData} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-slate-300">No movie information available</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}