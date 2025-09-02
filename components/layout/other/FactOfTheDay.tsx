"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLightbulb,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

interface Fact {
  text: string;
  category: string;
}

export const FactOfTheDay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const factsToShow = 6;

  const fetchFacts = async (count: number): Promise<Fact[]> => {
    const requests = Array.from({ length: count }).map(async () => {
      const res = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
        {
          cache: "no-store",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch fact");
      }
      const data = await res.json();
      return {
        text: data?.text ?? "Interesting fact unavailable right now.",
        category: data?.source ?? "General",
      } as Fact;
    });
    const results = await Promise.allSettled(requests);
    const successful = results
      .filter(
        (r): r is PromiseFulfilledResult<Fact> => r.status === "fulfilled",
      )
      .map((r) => r.value);
    if (successful.length === 0) {
      throw new Error("No facts available");
    }
    return successful;
  };

  const {
    data: facts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["facts", factsToShow],
    queryFn: () => fetchFacts(factsToShow),
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!facts || facts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [facts]);

  const loading = isLoading || isRefetching;

  const currentFact = useMemo(() => {
    if (!facts || facts.length === 0) return null;
    return facts[currentIndex % facts.length];
  }, [facts, currentIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-glow p-4 sm:p-6 relative overflow-hidden hover:bg-card/80 transition-colors group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-accent opacity-10 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-primary text-glow-primary flex items-center gap-1.5 sm:gap-2">
            <FaLightbulb className="text-accent w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Fact of the Day</span>
          </h3>
          <motion.button
            onClick={() => {
              setCurrentIndex(0);
              refetch();
            }}
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 sm:p-2 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors disabled:opacity-50"
          >
            <motion.div
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: loading ? Infinity : 0,
                ease: "linear",
              }}
            >
              <FaSyncAlt className="text-secondary w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
          </motion.button>
        </div>

        {loading ? (
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>
        ) : currentFact ? (
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <button
                aria-label="Previous fact"
                className="p-1.5 sm:p-2 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors"
                onClick={() =>
                  setCurrentIndex(
                    (prev) =>
                      (prev - 1 + (facts?.length ?? 1)) % (facts?.length ?? 1),
                  )
                }
              >
                <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
              </button>
              <div className="text-xs text-muted-foreground">
                {((currentIndex % (facts?.length ?? 1)) + 1)
                  .toString()
                  .padStart(2, "0")}{" "}
                / {(facts?.length ?? 1).toString().padStart(2, "0")}
              </div>
              <button
                aria-label="Next fact"
                className="p-1.5 sm:p-2 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors"
                onClick={() =>
                  setCurrentIndex((prev) => (prev + 1) % (facts?.length ?? 1))
                }
              >
                <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentFact.text}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-2 sm:mb-3 group-hover:text-white transition-colors">
                  {currentFact.text}
                </p>
                <div className="inline-block">
                  <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                    {currentFact.category}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {facts && facts.length > 1 && (
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2">
                {facts.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to fact ${idx + 1}`}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${idx === currentIndex % facts.length ? "w-3 sm:w-4 bg-accent" : "w-1.5 sm:w-2 bg-muted"}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-xs sm:text-sm">
            Unable to load facts. Try refreshing!
          </p>
        )}
      </div>
    </motion.div>
  );
};
