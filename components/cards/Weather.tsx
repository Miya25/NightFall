"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThermometer,
  WiHumidity,
  WiStrongWind,
} from "react-icons/wi";
import { FaMapMarkerAlt, FaSyncAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface WeatherData {
  temperature: number; // Celsius
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  humidity: number; // percent
  windSpeed: number; // km/h
  location: string;
}

interface WeatherWidgetProps {
  onWeatherUpdate?: (weather: WeatherData | null) => void;
}

async function geocodeCity(
  query: string,
): Promise<{ name: string; latitude: number; longitude: number } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const first = data?.results?.[0];
  if (!first) return null;
  return {
    name: `${first.name}${first.country ? ", " + first.country : ""}`,
    latitude: first.latitude,
    longitude: first.longitude,
  };
}

async function getWeatherByCoords(
  lat: number,
  lon: number,
): Promise<{ tempC: number; windKmh: number; humidity: number; code: number }> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();
  return {
    tempC: data?.current?.temperature_2m,
    windKmh: data?.current?.wind_speed_10m,
    humidity: data?.current?.relative_humidity_2m,
    code: data?.current?.weather_code,
  };
}

function mapWmoToCondition(code: number): WeatherData["condition"] {
  // Simplified mapping
  if ([0].includes(code)) return "sunny";
  if ([1, 2, 3, 45, 48].includes(code)) return "cloudy";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  return "cloudy";
}

export const WeatherWidget = ({ onWeatherUpdate }: WeatherWidgetProps) => {
  const queryClient = useQueryClient();
  const [customLocation, setCustomLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [manualCoords, setManualCoords] = useState<{
    lat: number;
    lon: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    // prime caches for geolocation-based weather
    queryClient.prefetchQuery({
      queryKey: ["geo"],
    });
  }, [queryClient]);

  const { data: browserPosition } = useQuery({
    queryKey: ["browser-location"],
    queryFn: () =>
      new Promise<{ lat: number; lon: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported"));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => reject(new Error("Permission denied or unavailable")),
          { timeout: 8000 },
        );
      }),
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });

  const target = useMemo(() => {
    if (manualCoords) return manualCoords;
    if (browserPosition)
      return {
        lat: browserPosition.lat,
        lon: browserPosition.lon,
        label: "Your Location",
      };
    return null;
  }, [manualCoords, browserPosition]);

  const weatherQuery = useQuery({
    queryKey: ["weather", target?.lat, target?.lon],
    queryFn: async () => {
      if (!target) throw new Error("no-target");
      const current = await getWeatherByCoords(target.lat, target.lon);
      const condition = mapWmoToCondition(current.code);
      const result: WeatherData = {
        temperature: Math.round(current.tempC),
        condition,
        humidity: Math.round(current.humidity),
        windSpeed: Math.round(current.windKmh),
        location: target.label,
      };
      return result;
    },
    enabled: !!target,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 min
  });

  useEffect(() => {
    if (weatherQuery.data) onWeatherUpdate?.(weatherQuery.data);
  }, [weatherQuery.data, onWeatherUpdate]);

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = customLocation.trim();
    if (!q) return;
    const geo = await geocodeCity(q);
    if (geo) {
      setManualCoords({
        lat: geo.latitude,
        lon: geo.longitude,
        label: geo.name,
      });
    }
    setShowLocationInput(false);
    setCustomLocation("");
  };

  const getWeatherIcon = (condition: string) => {
    const iconProps = { size: 48, className: "weather-icon" };
    switch (condition) {
      case "sunny":
        return (
          <WiDaySunny
            {...iconProps}
            className={`${iconProps.className} text-weather-sunny`}
          />
        );
      case "cloudy":
        return (
          <WiCloudy
            {...iconProps}
            className={`${iconProps.className} text-weather-cloudy`}
          />
        );
      case "rainy":
        return (
          <WiRain
            {...iconProps}
            className={`${iconProps.className} text-weather-rainy`}
          />
        );
      case "snowy":
        return (
          <WiSnow
            {...iconProps}
            className={`${iconProps.className} text-weather-snowy`}
          />
        );
      default:
        return (
          <WiCloudy
            {...iconProps}
            className={`${iconProps.className} text-weather-cloudy`}
          />
        );
    }
  };

  if (weatherQuery.isLoading) {
    return (
      <div className="card-gothic p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Weather</h3>
        <div className="flex items-center justify-center h-24 sm:h-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!weatherQuery.data) {
    return (
      <div className="card-gothic p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Weather</h3>
        <p className="text-muted-foreground text-sm sm:text-base">Unable to load weather data</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-glow p-4 sm:p-6 hover:bg-card/80 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-primary text-glow-primary">
          Weather
        </h3>
        <div className="flex gap-1 sm:gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLocationInput(!showLocationInput)}
            className="p-1.5 sm:p-2"
          >
            <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => weatherQuery.refetch()}
            disabled={weatherQuery.isFetching}
            className="p-1.5 sm:p-2"
          >
            <motion.div
              animate={{ rotate: weatherQuery.isFetching ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: weatherQuery.isFetching ? Infinity : 0,
                ease: "linear",
              }}
            >
              <FaSyncAlt className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
          </Button>
        </div>
      </div>

      {showLocationInput && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleLocationSubmit}
          className="mb-3 sm:mb-4 flex gap-2"
        >
          <Input
            type="text"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 text-sm sm:text-base"
          />
          <Button type="submit" size="sm" className="text-sm">
            Set
          </Button>
        </motion.form>
      )}

      <div className="text-center mb-3 sm:mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-2"
        >
          {getWeatherIcon(weatherQuery.data.condition)}
        </motion.div>
        <div className="text-2xl sm:text-3xl font-bold text-primary text-glow-primary group-hover:text-white transition-colors">
          {weatherQuery.data.temperature}°C
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground capitalize group-hover:text-white/80 transition-colors">
          {weatherQuery.data.condition}
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-secondary group-hover:text-white transition-colors">
            <WiThermometer size={16} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Feels like</span>
          </div>
          <span className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors">
            {weatherQuery.data.temperature}°C
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-secondary group-hover:text-white transition-colors">
            <WiHumidity size={16} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Humidity</span>
          </div>
          <span className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors">
            {weatherQuery.data.humidity}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-secondary group-hover:text-white transition-colors">
            <WiStrongWind size={16} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">Wind</span>
          </div>
          <span className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors">
            {weatherQuery.data.windSpeed} km/h
          </span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {weatherQuery.data.location}
        </p>
      </div>
    </motion.div>
  );
};
