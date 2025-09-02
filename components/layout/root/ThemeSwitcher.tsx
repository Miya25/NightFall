"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { FaPalette, FaSun, FaMoon, FaLeaf, FaFire } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  {
    id: "gothic",
    name: "Gothic Dark",
    icon: FaMoon,
    color: "hsl(280, 80%, 65%)",
    description: "Dark gothic elegance",
  },
  {
    id: "blue",
    name: "Ocean Blue",
    icon: FaSun,
    color: "hsl(220, 80%, 60%)",
    description: "Cool ocean vibes",
  },
  {
    id: "red",
    name: "Fire Red",
    icon: FaFire,
    color: "hsl(0, 80%, 60%)",
    description: "Fiery energy",
  },
  {
    id: "green",
    name: "Nature Green",
    icon: FaLeaf,
    color: "hsl(120, 60%, 50%)",
    description: "Natural harmony",
  },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group relative overflow-hidden border border-primary/30 hover:border-primary/60 transition-all duration-300"
        >
          <motion.div
            className="flex items-center gap-2 relative z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPalette className="w-4 h-4" />
            <Icon
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: currentTheme.color }}
            />
            <span className="text-sm font-medium">Theme</span>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            layoutId="themeHover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="card-gothic border-primary/30 min-w-48"
      >
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          const isActive = theme === themeOption.id;

          return (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`
                flex items-center gap-3 p-3 cursor-pointer transition-all duration-300
                ${
                  isActive
                    ? "bg-muted/40 text-white hover:bg-muted/60 border-l-2 border-primary"
                    : "hover:bg-muted/60 hover:text-white"
                }
              `}
            >
              <ThemeIcon
                className="w-5 h-5"
                style={{ color: themeOption.color }}
              />
              <div className="flex-1">
                <div className="font-medium">{themeOption.name}</div>
                <div className="text-xs text-muted-foreground">
                  {themeOption.description}
                </div>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
