"use client";
import { motion } from "framer-motion";
import type React from "react";
import type { ClockStyle } from "../Layout";
import { MoonPhaseTooltip } from "../../other/Moonphase";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  humidity: number;
  windSpeed: number;
  location: string;
}

interface ClockFaceProps {
  time: Date;
  style: ClockStyle;
  timezone: string;
  weather?: WeatherData | null;
}

export const ClockFace = ({
  time,
  style,
  timezone,
  weather,
}: ClockFaceProps) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const formatTime = (format: "digital" | "full") => {
    if (format === "digital") {
      return time.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return time.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderAnalogClock = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="clock-analog aspect-square relative bg-gradient-radial from-background via-background to-card border-2 border-primary/30 rounded-full p-2 sm:p-4">
        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 sm:w-1 h-4 sm:h-8 bg-clock-numbers rounded-full"
            style={{
              top: "8px",
              left: "50%",
              transformOrigin: "50% 50%",
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Hour numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const radius = 40; // Responsive radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const number = i === 0 ? 12 : i;

          return (
            <div
              key={i}
              className="absolute text-sm sm:text-2xl font-bold text-clock-numbers text-glow-primary select-none z-20"
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                transform: "translate(-50%, -50%)",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {number}
            </div>
          );
        })}

        {/* Clock hands */}
        <motion.div
          className="absolute w-1 sm:w-2 bg-clock-hands rounded-full origin-bottom glow-primary z-10"
          style={{
            height: "25%",
            left: "50%",
            bottom: "50%",
            transformOrigin: "center bottom",
          }}
          animate={{ rotate: hourAngle }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />

        <motion.div
          className="absolute w-0.5 sm:w-1 bg-clock-hands rounded-full origin-bottom glow-secondary z-10"
          style={{
            height: "35%",
            left: "50%",
            bottom: "50%",
            transformOrigin: "center bottom",
          }}
          animate={{ rotate: minuteAngle }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />

        <motion.div
          className="absolute w-px bg-accent rounded-full origin-bottom glow-accent z-10"
          style={{
            height: "40%",
            left: "50%",
            bottom: "50%",
            transformOrigin: "center bottom",
          }}
          animate={{ rotate: secondAngle }}
          transition={{ type: "spring", stiffness: 200, damping: 50 }}
        />

        {/* Center dot */}
        <div className="absolute w-3 h-3 sm:w-6 sm:h-6 bg-clock-center rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glow-primary z-20" />
      </div>
    </div>
  );

  const renderDigitalClock = () => (
    <div className="clock-digital w-full max-w-6xl mx-auto p-4 sm:p-8">
      <div className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-mono text-primary text-glow-primary mb-4 sm:mb-6 leading-none text-center">
        {formatTime("digital")}
      </div>
      <div className="text-base sm:text-xl lg:text-2xl text-secondary text-glow-secondary text-center">
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="text-sm sm:text-lg text-muted-foreground mt-2 sm:mt-4 text-center">
        {timezone.replace("_", " ")}
      </div>
    </div>
  );

  const renderNeonClock = () => (
    <div className="clock-neon w-full max-w-6xl mx-auto p-4 sm:p-8">
      <motion.div
        className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-mono text-accent text-glow-accent mb-6 sm:mb-8 leading-none text-center"
        animate={{
          textShadow: [
            "0 0 10px currentColor",
            "0 0 20px currentColor, 0 0 30px currentColor",
            "0 0 10px currentColor",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {formatTime("digital")}
      </motion.div>
      <div className="text-base sm:text-xl lg:text-2xl text-accent/80 text-glow-accent text-center">
        {time.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );

  const getMoonPhase = () => {
    const now = new Date();
    const lunarCycle = 29.53058867;
    const referenceNewMoon = new Date("2000-01-06");
    const daysSinceReference =
      (now.getTime() - referenceNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const currentCycle = daysSinceReference % lunarCycle;

    if (currentCycle < 1) return { phase: "new", icon: "🌑" };
    if (currentCycle < 7.4) return { phase: "waxing-crescent", icon: "🌒" };
    if (currentCycle < 8.4) return { phase: "first-quarter", icon: "🌓" };
    if (currentCycle < 14.8) return { phase: "waxing-gibbous", icon: "🌔" };
    if (currentCycle < 15.8) return { phase: "full", icon: "🌕" };
    if (currentCycle < 22.1) return { phase: "waning-gibbous", icon: "🌖" };
    if (currentCycle < 23.1) return { phase: "last-quarter", icon: "🌗" };
    return { phase: "waning-crescent", icon: "🌘" };
  };

  const renderWeatherElement = () => {
    const hour = time.getHours();
    const isNight = hour < 6 || hour > 18;

    if (isNight) {
      const moonPhase = getMoonPhase();
      return (
        <MoonPhaseTooltip phase={moonPhase}>
          <motion.div
            className="absolute -top-3 sm:-top-6 right-2 sm:right-4 text-2xl sm:text-4xl cursor-help"
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {moonPhase.icon}
          </motion.div>
        </MoonPhaseTooltip>
      );
    }

    if (weather?.condition === "cloudy") {
      return (
        <motion.div
          className="absolute -top-3 sm:-top-6 right-2 sm:right-4 text-2xl sm:text-4xl"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ☁️
        </motion.div>
      );
    }

    if (weather?.condition === "rainy") {
      return (
        <motion.div
          className="absolute -top-3 sm:-top-6 right-2 sm:right-4 text-2xl sm:text-4xl"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🌧️
        </motion.div>
      );
    }

    if (weather?.condition === "snowy") {
      return (
        <motion.div
          className="absolute -top-3 sm:-top-6 right-2 sm:right-4 text-2xl sm:text-4xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          ❄️
        </motion.div>
      );
    }

    return <div className="absolute -top-3 sm:-top-6 right-2 sm:right-4 text-2xl sm:text-4xl">☀️</div>;
  };

  const renderGothicClock = () => (
    <div className="w-full max-w-7xl mx-auto relative">
      <div className="card-glow p-4 sm:p-8 lg:p-12 relative bg-gradient-to-b from-card to-background border-2 border-primary/30">
        <div className="absolute -top-3 sm:-top-6 left-1/2 transform -translate-x-1/2 w-12 h-6 sm:w-20 sm:h-10 bg-gradient-primary rounded-t-full border-2 border-primary/50"></div>

        {renderWeatherElement()}

        <div className="relative z-10 text-center mb-4 sm:mb-8">
          <div className="absolute inset-0 border-2 sm:border-4 border-primary/20 rounded-lg"></div>
          <div className="absolute inset-2 sm:inset-4 border-2 border-accent/30 rounded-lg"></div>

          <motion.div
            className="relative z-10 text-3xl sm:text-5xl lg:text-7xl xl:text-9xl font-serif text-primary text-glow-primary mb-4 sm:mb-6 leading-none px-2 sm:px-8"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {formatTime("digital")}
          </motion.div>

          <div className="flex justify-between text-sm sm:text-lg text-accent/70 font-serif mb-4 sm:mb-6 px-8 sm:px-16">
            <span>XII</span>
            <span>III</span>
            <span>VI</span>
            <span>IX</span>
          </div>
        </div>

        <div className="border-t-2 border-primary/30 pt-4 sm:pt-6">
          <motion.div
            className="w-4 h-12 sm:w-6 sm:h-20 bg-gradient-to-b from-primary to-accent rounded-full mx-auto relative"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute bottom-0 w-6 h-6 sm:w-8 sm:h-8 bg-accent rounded-full -left-1 border-2 border-primary"></div>
          </motion.div>
        </div>

        <div className="text-center mt-4 sm:mt-6">
          <div className="text-lg sm:text-2xl text-secondary text-glow-secondary mb-2 sm:mb-3">
            {time.toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </div>
          <div className="text-sm sm:text-lg text-muted-foreground">
            {time.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-sm sm:text-base text-accent mt-2 sm:mt-3 text-glow-accent">
            {timezone.replace("_", " ").replace("/", " / ")}
          </div>
        </div>

        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-6 h-6 sm:w-10 sm:h-10 border-l-2 border-t-2 border-primary/50"></div>
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-6 h-6 sm:w-10 sm:h-10 border-r-2 border-t-2 border-primary/50"></div>
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-6 h-6 sm:w-10 sm:h-10 border-l-2 border-b-2 border-primary/50"></div>
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-6 h-6 sm:w-10 sm:h-10 border-r-2 border-b-2 border-primary/50"></div>
      </div>

      <div className="h-4 sm:h-6 bg-gradient-to-r from-card via-primary/20 to-card border-x-2 border-primary/30"></div>
      <div className="h-2 sm:h-3 bg-gradient-to-r from-background via-primary/10 to-background"></div>
    </div>
  );

  const clockRenderers: Record<ClockStyle, () => React.ReactElement> = {
    analog: renderAnalogClock,
    digital: renderDigitalClock,
    neon: renderNeonClock,
    gothic: renderGothicClock,
  };

  return (
    <motion.div
      key={style}
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 90 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full"
    >
      {clockRenderers[style]()}
    </motion.div>
  );
};
