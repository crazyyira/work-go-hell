'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const RetroButton = ({ 
  children, 
  onClick, 
  className, 
  disabled 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "retro-border px-6 py-2 font-retro text-xl active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-retro-yellow cursor-pointer",
      className
    )}
  >
    {children}
  </button>
);

