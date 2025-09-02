"use client";
import { motion } from 'framer-motion';
import type { ClockStyle } from '../Layout';
import { FaClock, FaDesktop, FaBolt, FaSkull } from 'react-icons/fa';

interface ClockStyleSelectorProps {
  value: ClockStyle;
  onChange: (style: ClockStyle) => void;
}

export const ClockStyleSelector = ({ value, onChange }: ClockStyleSelectorProps) => {
  const styles = [
    { 
      id: 'analog' as ClockStyle, 
      name: 'Analog', 
      icon: FaClock,
      description: 'Classic analog clock with hands'
    },
    { 
      id: 'digital' as ClockStyle, 
      name: 'Digital', 
      icon: FaDesktop,
      description: 'Modern digital display'
    },
    { 
      id: 'neon' as ClockStyle, 
      name: 'Neon', 
      icon: FaBolt,
      description: 'Cyberpunk neon glow'
    },
    { 
      id: 'gothic' as ClockStyle, 
      name: 'Gothic', 
      icon: FaSkull,
      description: 'Dark gothic elegance'
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-primary font-medium text-sm">Style:</span>
      <div className="flex gap-2">
        {styles.map((style) => {
          const Icon = style.icon;
          const isActive = value === style.id;
          
          return (
            <motion.button
              key={style.id}
              onClick={() => onChange(style.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-4 py-2 rounded-lg border transition-all duration-300 flex items-center gap-2
                ${isActive 
                  ? 'bg-primary text-primary-foreground border-primary shadow-glow' 
                  : 'bg-card/50 text-foreground border-border hover:bg-card/80 hover:border-primary/50 hover:text-white'
                }
              `}
              title={style.description}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{style.name}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -inset-px rounded-lg bg-gradient-primary opacity-20 -z-10"
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};