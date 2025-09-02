import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="gothic"
      themes={["gothic", "blue", "red", "green"]}
      enableSystem={false}
      storageKey="gothic-clock-theme"
    >
      {children}
    </NextThemesProvider>
  );
};
