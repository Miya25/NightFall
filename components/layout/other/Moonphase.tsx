"use client";
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MoonPhaseTooltipProps {
  phase: {
    phase: string;
    icon: string;
  };
  children: React.ReactNode;
}

export const MoonPhaseTooltip = ({ phase, children }: MoonPhaseTooltipProps) => {
  const getPhaseDescription = (phaseName: string) => {
    const descriptions: { [key: string]: string } = {
      'new': 'New Moon - The moon is not visible',
      'waxing-crescent': 'Waxing Crescent - Growing towards first quarter',
      'first-quarter': 'First Quarter - Half moon, growing',
      'waxing-gibbous': 'Waxing Gibbous - More than half, still growing',
      'full': 'Full Moon - Fully illuminated',
      'waning-gibbous': 'Waning Gibbous - More than half, shrinking',
      'last-quarter': 'Last Quarter - Half moon, shrinking',
      'waning-crescent': 'Waning Crescent - Crescent, shrinking'
    };
    
    return descriptions[phaseName] || 'Moon phase';
  };

  const formatPhaseName = (phaseName: string) => {
    return phaseName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="cursor-help"
          >
            {children}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="card-gothic border-primary/30 max-w-64"
          align="center"
          sideOffset={8}
          avoidCollisions
          collisionPadding={8}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">{phase.icon}</div>
            <div>
              <div className="font-semibold text-primary">
                {formatPhaseName(phase.phase)}
              </div>
              <div className="text-sm text-muted-foreground">
                {getPhaseDescription(phase.phase)}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
