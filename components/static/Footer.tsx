"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

export const Footer = () => {
  const { theme } = useTheme();
  const logoSrc =
    theme === "blue"
      ? "/icons/logo-blue.svg"
      : theme === "red"
        ? "/icons/logo-red.svg"
        : theme === "green"
          ? "/icons/logo-green.svg"
          : "/icons/logo-gothic.svg";

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mt-8 sm:mt-16 border-t border-border/30 pt-6 sm:pt-8 pb-4 sm:pb-6"
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-4 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={logoSrc}
              alt="Nightfall"
              width={24}
              height={24}
              className="sm:w-7 sm:h-7"
              priority
            />
            <span className="text-sm sm:text-base text-foreground font-semibold">Nightfall</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <span>Elegant • Precise • Timeless</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nightfall
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
