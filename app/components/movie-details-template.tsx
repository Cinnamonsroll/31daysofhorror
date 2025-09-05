"use client"

import { motion } from "framer-motion"
import { Play, Clock, Calendar, Users, Star, Award } from "lucide-react"

interface MovieInfo {
  title: string
  year: string
  director: string
  cast: string
  synopsis: string
  watchLink: string
  poster: string
  genre: string
  rating: string
  runtime: string
}

interface MovieDetailsTemplateProps {
  movieInfo: MovieInfo
}

export function MovieDetailsTemplate({ movieInfo }: MovieDetailsTemplateProps) {
  const castArray = movieInfo.cast
    ? movieInfo.cast
        .split(",")
        .map((actor) => actor.trim())
        .filter(Boolean)
    : []

  const displayData = {
    title: movieInfo.title || "Coming Soon...",
    poster: movieInfo.poster || "/horror-movie-poster.png",
    synopsis:
      movieInfo.synopsis ||
      "Movie details will be available soon. Check back later for the full synopsis, cast information, and streaming details.",
    cast: castArray.length > 0 ? castArray : ["Cast information coming soon"],
    director: movieInfo.director || "Director TBA",
    genre: movieInfo.genre || "Horror",
    rating: movieInfo.rating || "Not Rated",
    runtime: movieInfo.runtime || "Runtime TBA",
    year: movieInfo.year || "2024",
    watchUrl: movieInfo.watchLink || "#",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        <div className="md:w-80 flex-shrink-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <img
              src={displayData.poster || "/placeholder.svg?height=450&width=300"}
              alt={displayData.title}
              className="w-full rounded-lg shadow-2xl border border-red-900/30 aspect-[2/3] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {displayData.watchUrl && displayData.watchUrl !== "#" && (
              <motion.a
                href={displayData.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-red-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-lg">
                  <Play className="w-5 h-5" />
                  Watch Now
                </div>
              </motion.a>
            )}
          </motion.div>

          {displayData.watchUrl && displayData.watchUrl !== "#" && (
            <motion.a
              href={"http://djwatch.ashmw.tech/"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-4 px-6 py-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-900/50 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Play className="w-5 h-5" />
              Watch now
            </motion.a>
          )}
        </div>

        
        <div className="flex-1 space-y-6">
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-100 mb-2 text-balance">
              {displayData.title}
            </h1>
            {displayData.year && displayData.year !== "2024" && (
              <p className="text-xl text-gray-300">({displayData.year})</p>
            )}
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-200 font-semibold">{displayData.rating}</span>
            </div>
            <div className="px-3 py-1.5 bg-red-900/30 border border-red-600/30 text-red-200 rounded-full font-medium">
              {displayData.genre}
            </div>
            {displayData.runtime && displayData.runtime !== "Runtime TBA" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-600/30 text-gray-200 rounded-full">
                <Clock className="w-4 h-4" />
                <span>{displayData.runtime}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-600/30 text-gray-200 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>{displayData.year}</span>
            </div>
          </motion.div>

          {displayData.director && displayData.director !== "Director TBA" && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-semibold">Directed by:</span>
              <span className="text-gray-200 text-lg">{displayData.director}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-bold text-red-200 flex items-center gap-2">Plot Summary</h2>
            <p className="text-gray-300 leading-relaxed text-lg text-pretty">{displayData.synopsis}</p>
          </motion.div>
        </div>
      </div>

      {displayData.cast.length > 0 && displayData.cast[0] !== "Cast information coming soon" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-red-200 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Cast & Crew
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayData.cast.slice(0, 9).map((actor, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-600/30 rounded-lg hover:border-red-600/50 transition-all duration-200 hover:bg-gray-700/50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center border border-red-600/30">
                  <Users className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-gray-200 font-medium">{actor}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
