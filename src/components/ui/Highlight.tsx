import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HighlightProps {
  children: ReactNode;
  className?: string;
  color?: string;
  delay?: number;
}

export function Highlight({ 
  children, 
  className,
  color = "text-[#0E5D47]/20",
  delay = 0.2 
}: HighlightProps) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg 
        className={cn("absolute left-0 w-full h-[0.7em] bottom-[0.1em] z-[-1]", color)} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 500 150" 
        preserveAspectRatio="none" 
        aria-hidden="true"
      >
        <motion.path 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay }}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="24" 
          strokeLinecap="round" 
          d="M7.7,145.6C109,125,299.9,116.2,401,121.3c42.1,2.2,87.6,11.8,87.3,25.7"
        />
      </svg>
    </span>
  );
}
