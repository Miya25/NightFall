"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export const Footer = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'blue' ? '/icons/logo-blue.svg'
    : theme === 'red' ? '/icons/logo-red.svg'
    : theme === 'green' ? '/icons/logo-green.svg'
    : '/icons/logo-gothic.svg';

  return (
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 border-t border-border/30 pt-8 pb-6"
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Image src={logoSrc} alt="Nightfall" width={28} height={28} priority />
                <span className="text-foreground font-semibold">Nightfall</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Elegant • Precise • Timeless</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
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