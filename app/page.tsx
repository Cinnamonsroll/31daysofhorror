"use client";

import { Suspense } from "react";
import AtmosphericBackground from "./components/atmospheric-background";
import { HorrorCalendar } from "./components/horror-calendar";
import { useRouter } from "next/navigation";
import { getCurrentYear } from "./lib/google-sheets";
export default function HomePage() {
  const router = useRouter();
  const year = getCurrentYear();
  return (
    <main className="min-h-screen bg-background relative">
      <AtmosphericBackground />

      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-8 md:mb-16">
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 md:mb-6 font-creepster tracking-wider relative">
              <span className="relative z-10">31 DAYS OF HORROR</span>
              <div className="absolute inset-0 text-primary/20 blur-sm">
                31 DAYS OF HORROR
              </div>
            </h1>

            <div className="flex justify-center items-center gap-4 mb-4 md:mb-6">
              <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent to-primary"></div>
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
              </svg>
              <div className="w-12 md:w-16 h-0.5 bg-gradient-to-l from-transparent to-primary"></div>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-mono tracking-wide px-4">
              A spine-chilling movie for every October night
            </p>

            <p className="text-sm text-muted-foreground/70 mt-4 italic px-4">
              &quot;In the darkness of October, horror comes alive...&quot;
            </p>

            <div className="mt-8">
              <button
                onClick={() => router.push(`${+year - 1}`)}
                className="group relative px-6 py-3 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-800/30 rounded-lg text-red-400 font-mono text-sm hover:from-red-800/30 hover:to-red-700/30 transition-all duration-300 overflow-hidden"
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
                  View Previous Years
                </span>
              </button>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 px-4">
              <div className="relative">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-primary animate-bounce"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.69 2 6 4.69 6 8v8l2-2 2 2 2-2 2 2 2-2 2 2V8c0-3.31-2.69-6-6-6zm-2 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
                <svg
                  className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse opacity-50"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.69 2 6 4.69 6 8v8l2-2 2 2 2-2 2 2 2-2 2 2V8c0-3.31-2.69-6-6-6zm-2 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
              </div>
              <div className="text-xl md:text-2xl text-muted-foreground animate-pulse font-mono text-center">
                Summoning the horror collection...
              </div>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          }
        >
          <HorrorCalendar />
        </Suspense>
      </div>
    </main>
  );
}
