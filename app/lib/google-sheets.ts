export interface MovieData {
  [year: string]: string[];
}

export interface DateInfo {
  year: number;
  month: number;
  day: number;
  isOctober: boolean;
  currentDay: number;
  daysIntoOctober: number;
  daysUntilOctober: number;
  timeUntilOctober: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}


interface SheetCache {
  data: MovieData;
  timestamp: number;
}


const CACHE_DURATION = 6 * 60 * 60 * 1000;


let sheetCache: SheetCache | null = null;


function loadCacheFromStorage(): SheetCache | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem('sheetCache');
    if (cached) {
      const parsedCache = JSON.parse(cached) as SheetCache;
      
      if (Date.now() - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache;
      }
    }
  } catch (error) {
    console.error('Failed to load sheet cache from storage:', error);
  }
  return null;
}


function saveCacheToStorage(cache: SheetCache): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('sheetCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save sheet cache to storage:', error);
  }
}


if (typeof window !== 'undefined') {
  sheetCache = loadCacheFromStorage();
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function getMoviesFromSheet(): Promise<MovieData> {
  if (sheetCache && Date.now() - sheetCache.timestamp < CACHE_DURATION) {
    return sheetCache.data;
  }

  if (!sheetCache) {
    const storedCache = loadCacheFromStorage();
    if (storedCache) {
      sheetCache = storedCache;
      return storedCache.data;
    }
  }

  try {
    const sheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
    console.log(sheetId)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

    const response = await fetch(csvUrl, {
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sheet data: ${response.status} ${response.statusText}`
      );
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("Empty CSV data received");
    }

    const movieData: MovieData = {};
    const headers = parseCSVLine(lines[0]);

    headers.forEach((year, columnIndex) => {
      const yearNum = Number.parseInt(year.trim());
      if (year && !isNaN(yearNum) && yearNum >= 2020 && yearNum <= 2030) {
        movieData[year] = [];

        for (let rowIndex = 1; rowIndex <= 31 && rowIndex < lines.length; rowIndex++) {
          const cells = parseCSVLine(lines[rowIndex]);
          const movie = cells[columnIndex]?.trim();
          if (movie && movie !== "") {
            movieData[year].push(movie);
          } else {
            movieData[year].push(`Day ${rowIndex} - Horror Movie TBA`);
          }
        }

   
        if (year === getCurrentYear()) {
          const first30 = movieData[year].slice(0, 30);
          const last = movieData[year][30]; // 31st movie
          movieData[year] = [...shuffleArray(first30), last];
        }

        while (movieData[year].length < 31) {
          movieData[year].push(`Day ${movieData[year].length + 1} - Horror Movie TBA`);
        }
      }
    });

    const currentYear = getCurrentYear();
    if (!movieData[currentYear]) {
      movieData[currentYear] = Array.from(
        { length: 31 },
        (_, i) => `Day ${i + 1} - Horror Movie Coming Soon...`
      );
    }

    const newCache: SheetCache = {
      data: movieData,
      timestamp: Date.now()
    };

    sheetCache = newCache;
    saveCacheToStorage(newCache);

    return movieData;
  } catch (error) {
    console.error("Error fetching movies from sheet:", error);

    if (sheetCache) {
      console.log("Using expired cache due to fetch error");
      return sheetCache.data;
    }

    const currentYear = getCurrentYear();
    const fallbackData: MovieData = {};

    for (
      let year = Number.parseInt(currentYear) - 2;
      year <= Number.parseInt(currentYear) + 1;
      year++
    ) {
      fallbackData[year.toString()] = Array.from(
        { length: 31 },
        (_, i) => `Day ${i + 1} - Classic Horror Film`
      );
    }

    return fallbackData;
  }
}


function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function getDateInfo(timezone?: string): DateInfo {
  const now = timezone
    ? new Date(new Date().toLocaleString("en-US", { timeZone: timezone }))
    : new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const isOctober = month === 9;
  const currentDay = isOctober ? day : 0;

  const daysIntoOctober = isOctober ? day : 0;

  const currentYearOct1 = new Date(year, 9, 1);
  const nextOct1 =
    now > currentYearOct1 ? new Date(year + 1, 9, 1) : currentYearOct1;

  const timeDiff = nextOct1.getTime() - now.getTime();
  const daysUntilOctober = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  const timeUntilOctober = {
    days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((timeDiff / 1000 / 60) % 60),
    seconds: Math.floor((timeDiff / 1000) % 60),
  };

  return {
    year,
    month,
    day,
    isOctober,
    currentDay,
    daysIntoOctober,
    daysUntilOctober,
    timeUntilOctober,
  };
}

export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

export function isOctober(timezone?: string): boolean {
  const dateInfo = getDateInfo(timezone);
  return dateInfo.isOctober;
}

export function getCurrentDay(timezone?: string): number {
  const dateInfo = getDateInfo(timezone);
  return dateInfo.currentDay;
}

export function getDaysUntilOctober(timezone?: string): number {
  const dateInfo = getDateInfo(timezone);
  return dateInfo.daysUntilOctober;
}

export function getTimeUntilOctober(timezone?: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const dateInfo = getDateInfo(timezone);
  return dateInfo.timeUntilOctober;
}

export function isDayAccessible(
  day: number,
  year: string,
  timezone?: string
): boolean {
  const dateInfo = getDateInfo(timezone);
  const currentYear = dateInfo.year.toString();

  if (Number.parseInt(year) < dateInfo.year) {
    return true;
  }

  if (Number.parseInt(year) > dateInfo.year) {
    return false;
  }

  if (year === currentYear) {
    if (dateInfo.isOctober) {
      return day <= dateInfo.currentDay;
    }

    return false;
  }

  return false;
}

export function getDayStatus(
  day: number,
  year: string,
  timezone?: string
): "future-year" | "future-day" | "current" | "past" | "available" {
  const dateInfo = getDateInfo(timezone);
  const currentYear = dateInfo.year.toString();

  if (Number.parseInt(year) < dateInfo.year) {
    return "available";
  }

  if (Number.parseInt(year) > dateInfo.year) {
    return "future-year";
  }

  if (year === currentYear) {
    if (!dateInfo.isOctober) {
      return "future-day";
    }

    if (day < dateInfo.currentDay) {
      return "past";
    } else if (day === dateInfo.currentDay) {
      return "current";
    } else {
      return "future-day";
    }
  }

  return "future-day";
}

export function formatTimeRemaining(timeLeft: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string {
  const { days, hours, minutes, seconds } = timeLeft;

  if (days > 0) {
    return `${days} days, ${hours} hours`;
  } else if (hours > 0) {
    return `${hours} hours, ${minutes} minutes`;
  } else if (minutes > 0) {
    return `${minutes} minutes, ${seconds} seconds`;
  } else {
    return `${seconds} seconds`;
  }
}

export function isHalloween(timezone?: string): boolean {
  const dateInfo = getDateInfo(timezone);
  return dateInfo.isOctober && dateInfo.day === 31;
}

export function getOctoberProgress(timezone?: string): number {
  const dateInfo = getDateInfo(timezone);
  if (!dateInfo.isOctober) return 0;
  return Math.min((dateInfo.day / 31) * 100, 100);
}
