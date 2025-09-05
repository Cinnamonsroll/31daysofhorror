import { Suspense } from "react";
import { notFound } from "next/navigation";

import AtmosphericBackground from "../components/atmospheric-background";
import { HorrorCalendar } from "../components/horror-calendar";
import { getCurrentYear } from "../lib/google-sheets";


interface YearPageProps {
    year: string;

}


export async function generateStaticParams() {
  const currentYear = Number.parseInt(getCurrentYear());
  const years = [];

  for (let year = currentYear - 3; year <= currentYear + 1; year++) {
    years.push({ year: year.toString() });
  }

  return years;
}

export default function YearPage({ year: paramsYear }: YearPageProps) {
  const year = Number.parseInt(paramsYear);

  if (isNaN(year)) {
    notFound();
  }

  if (year < 2020 || year > 2030) {
    notFound();
  }

  const currentYear = getCurrentYear();
  const isCurrentYear = year.toString() === currentYear;

  return (
    <main className="min-h-screen bg-background relative">
      <AtmosphericBackground />

      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-16">
          <div className="relative">
            <h1 className="text-7xl md:text-8xl font-bold text-foreground mb-6 font-creepster tracking-wider relative">
              <span className="relative z-10">31 DAYS OF HORROR</span>
              <div className="absolute inset-0 text-primary/20 blur-sm">
                31 DAYS OF HORROR
              </div>
            </h1>

            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary"></div>
              <div className="text-4xl animate-pulse">
                {isCurrentYear ? "🎃" : "📅"}
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary"></div>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground font-mono tracking-wide">
              {isCurrentYear
                ? "A spine-chilling movie for every October night"
                : `Relive the horror collection from October ${year}`}
            </p>

            <div className="mt-4 flex justify-center items-center gap-2">
              <span className="text-sm text-muted-foreground/70 italic">
                {isCurrentYear ? "Current Year" : "Archive"}
              </span>
              <span className="text-primary font-bold text-lg">•</span>
              <span className="text-sm text-muted-foreground/70 italic">
                October {year}
              </span>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="relative">
                <div className="text-6xl animate-bounce">👻</div>
                <div className="absolute inset-0 text-6xl animate-pulse opacity-50">
                  👻
                </div>
              </div>
              <div className="text-2xl text-muted-foreground animate-pulse font-mono">
                Loading {year} horror collection...
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
          <HorrorCalendar initialYear={year.toString()} />
        </Suspense>
      </div>
    </main>
  );
}
