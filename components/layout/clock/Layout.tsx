"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClockFace } from "./components/ClockFaces";
import { WeatherWidget } from "@/components/cards/Weather";
import { FactOfTheDay } from "@/components/layout/other/FactOfTheDay";
import { TimezoneSelector } from "@/components/layout/other/TimezoneSelector";
import { ClockStyleSelector } from "./components/ClockStyleSelector";
import { ThemeSwitcher } from "@/components/layout/root/ThemeSwitcher";
import { Footer } from "@/components/static/Footer";
import { useLocalStorageState } from "@/lib/utils/useLocalStorage";

export type ClockStyle = "analog" | "digital" | "neon" | "gothic";

type ClockProps = object;

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  humidity: number;
  windSpeed: number;
  location: string;
}

export const Layout = ({}: ClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useLocalStorageState<string>(
    "nf_timezone",
    "",
  );
  const [clockStyle, setClockStyle] = useState<ClockStyle>("gothic");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Helper to validate time zone identifiers
  const isValidTimeZone = (tz: string | undefined | null) => {
    if (!tz) return false;
    try {
      // Throws if invalid
      new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(0);
      return true;
    } catch {
      return false;
    }
  };

  // Initialize timezone from storage, browser, or IST as a final fallback
  useEffect(() => {
    if (!isValidTimeZone(timezone)) {
      let nextTz = "";
      try {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (isValidTimeZone(browserTz)) nextTz = browserTz;
      } catch {}
      if (!nextTz) nextTz = "Asia/Kolkata"; // IST fallback
      setTimezone(nextTz);
    }
  }, [timezone, setTimezone]);

  const getTimeInTimezone = () => {
    let effectiveTz = timezone;
    if (!isValidTimeZone(effectiveTz)) {
      try {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (isValidTimeZone(browserTz)) effectiveTz = browserTz;
      } catch {}
    }
    if (!isValidTimeZone(effectiveTz)) {
      effectiveTz = "Asia/Kolkata";
    }
    return new Date(
      currentTime.toLocaleString("en-US", { timeZone: effectiveTz as string }),
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-pulse-glow"></div>
      <div className="absolute top-20 left-20 w-32 h-32 sm:w-64 sm:h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-20 w-48 h-48 sm:w-96 sm:h-96 bg-secondary/15 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4 sm:mb-8"
        >
          <div className="grid grid-cols-3 items-center mb-4">
            <div className="justify-self-start" />
            <h1 className="col-start-2 justify-self-center text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent text-glow-primary">
              Nightfall
            </h1>
            <div className="justify-self-end">
              <ThemeSwitcher />
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg text-center">
            Elegant • Precise • Timeless
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          <TimezoneSelector value={timezone} onChange={setTimezone} />
          <ClockStyleSelector value={clockStyle} onChange={setClockStyle} />
        </motion.div>

        {/* Main Clock - Much Wider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-none mx-auto mb-6 sm:mb-8 px-2 sm:px-4"
        >
          <ClockFace
            time={getTimeInTimezone()}
            style={clockStyle}
            timezone={timezone}
            weather={weather}
          />
        </motion.div>

        {/* Weather and Fact Cards Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto"
        >
          <WeatherWidget
            onWeatherUpdate={(w) => {
              setWeather(w);
            }}
          />
          <FactOfTheDay />
        </motion.div>

        {/* Additional Time Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto"
        >
          {[
            { name: "New York", tz: "America/New_York" },
            { name: "London", tz: "Europe/London" },
            { name: "Tokyo", tz: "Asia/Tokyo" },
            { name: "Sydney", tz: "Australia/Sydney" },
          ].map((city) => (
            <div
              key={city.tz}
              className="card-gothic p-3 sm:p-4 text-center hover:bg-card/80 transition-colors cursor-pointer group"
            >
              <h3 className="text-sm sm:text-lg font-semibold text-primary group-hover:text-white transition-colors">
                {city.name}
              </h3>
              <p className="text-lg sm:text-2xl font-mono text-foreground group-hover:text-white transition-colors">
                {new Date().toLocaleTimeString("en-US", {
                  timeZone: city.tz,
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                {new Date().toLocaleDateString("en-US", {
                  timeZone: city.tz,
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </motion.div>

        <Footer />
      </div>
    </div>
  );
};
