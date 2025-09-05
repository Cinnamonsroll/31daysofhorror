export interface MovieInfo {
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

const BASE_URL = "https://www.omdbapi.com/"
const DEMO_KEY = "thewdb" 


interface CacheEntry {
  data: MovieInfo
  timestamp: number
}

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000 
const movieCache = new Map<string, CacheEntry>()


function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_EXPIRATION
}


function loadCacheFromStorage() {
  if (typeof window === 'undefined') return
  
  try {
    const storedCache = localStorage.getItem('movieCache')
    if (storedCache) {
      const parsedCache = JSON.parse(storedCache) as Record<string, CacheEntry>
      Object.entries(parsedCache).forEach(([key, entry]) => {
        if (isCacheValid(entry)) {
          movieCache.set(key, entry)
        }
      })
    }
  } catch (error) {
    console.error('Failed to load cache from storage:', error)
  }
}


function saveCacheToStorage() {
  if (typeof window === 'undefined') return
  
  try {
    const cacheObj: Record<string, CacheEntry> = {}
    movieCache.forEach((value, key) => {
      cacheObj[key] = value
    })
    localStorage.setItem('movieCache', JSON.stringify(cacheObj))
  } catch (error) {
    console.error('Failed to save cache to storage:', error)
  }
}


if (typeof window !== 'undefined') {
  loadCacheFromStorage()
}

export async function getMovieInfo(title: string): Promise<MovieInfo | null> {
  const key = title.toLowerCase()

  
  const cachedEntry = movieCache.get(key)
  if (cachedEntry && isCacheValid(cachedEntry)) {
    return cachedEntry.data
  }

  try {
    const url = `${BASE_URL}?t=${encodeURIComponent(title)}&apikey=${DEMO_KEY}`
    const res = await fetch(url, { 
      cache: "force-cache",
      next: { revalidate: 86400 } 
    })

    if (!res.ok) throw new Error(`Failed to fetch movie: ${res.statusText}`)

    const data = await res.json()
    if (data.Response === "False") return null

    const movie: MovieInfo = {
      title: data.Title,
      year: data.Year,
      director: data.Director,
      cast: data.Actors,
      synopsis: data.Plot,
      watchLink: `https://www.imdb.com/title/${data.imdbID}/`,
      poster: data.Poster,
      genre: data.Genre,
      rating: data.imdbRating,
      runtime: data.Runtime,
    }

    
    movieCache.set(key, {
      data: movie,
      timestamp: Date.now()
    })

    
    saveCacheToStorage()
    
    return movie
  } catch (error) {
    console.error(`Error fetching movie info for "${title}":`, error)
    return null
  }
}
