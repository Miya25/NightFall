"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}
