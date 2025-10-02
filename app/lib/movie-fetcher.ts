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


export async function getMovieInfo(title: string): Promise<MovieInfo | null> {
  try {
    const url = `${BASE_URL}?t=${encodeURIComponent(title)}&apikey=${DEMO_KEY}`
    const res = await fetch(url, { cache: "no-store" }) 

    if (!res.ok) throw new Error(`Failed to fetch movie: ${res.statusText}`)

    const data = await res.json()
    if (data.Response === "False") return null

    return {
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
  } catch (error) {
    console.error(`Error fetching movie info for "${title}":`, error)
    return null
  }
}



function getCurrentYear(): string {
  return new Date().getFullYear().toString()
}


export async function getMoviesForYear(year: string): Promise<string[] | null> {
  try {
    const res = await fetch(`/api/movies/${encodeURIComponent(year)}`, {
      method: "GET",
      cache: "no-store", 
    })

    if (!res.ok) {
      console.error("API error:", res.statusText)
      return null
    }

    const movies: string[] = await res.json()

    return movies
  } catch (err) {
    console.error("Failed to fetch movies for year:", err)
    return null
  }
}
