'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { DivinationResult } from '@/lib/constants';
import { RetroButton } from './RetroButton';

interface DivinationSectionProps {
  divinationCount: number;
  isSpinning: boolean;
  isConsulting: boolean;
  lastDivination: DivinationResult | null;
  throwBei: () => void;
}

export const DivinationSection = ({
  divinationCount,
  isSpinning,
  isConsulting,
  lastDivination,
  throwBei,
}: DivinationSectionProps) => {
  return (
    <motion.div 
      key="divination"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center gap-16 py-12"
    >
      <div className="text-center">
        <h2 className="text-4xl font-serif-heavy mb-2">神圣仪式：赛博掷杯茭</h2>
        <p className="text-xl opacity-70">连续点击 3 次，诚心祈求上天指引 ({divinationCount}/3)</p>
      </div>

      <div className="relative h-64 w-64 flex items-center justify-center">
        <motion.div 
          animate={isSpinning ? { 
            rotate: [0, 360, 720, 1080],
            y: [0, -120, 0],
            scale: [1, 1.6, 1]
          } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={cn("flex gap-4", isSpinning && "animate-shake")}
        >
          <div className={cn(
            "w-24 h-12 bg-retro-red rounded-t-full border-4 border-retro-ink shadow-xl transition-transform duration-300",
            lastDivination === 'YIN' && "rotate-180"
          )} />
          <div className={cn(
            "w-24 h-12 bg-retro-red rounded-t-full border-4 border-retro-ink shadow-xl transition-transform duration-300",
            (lastDivination === 'SHENG' || lastDivination === 'XIAO') ? "rotate-180" : ""
          )} />
        </motion.div>

        {isConsulting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-retro-paper/80 z-10"
          >
            <p className="text-3xl font-serif-heavy animate-pulse">正在请示天意...</p>
          </motion.div>
        )}

        {lastDivination && !isSpinning && !isConsulting && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-[75%] text-2xl font-serif-heavy text-retro-red text-center w-[320px] z-50 bg-retro-paper/95 p-4 retro-border shadow-2xl"
          >
            <div className="text-sm italic opacity-60 mb-1 font-retro">—— 啪嗒! ——</div>
            {lastDivination === 'SHENG' && "圣杯：天意如此，神仙都劝你快跑。"}
            {lastDivination === 'XIAO' && "笑杯：神仙笑而不语，可能觉得你还没穷够。"}
            {lastDivination === 'YIN' && "阴杯：神仙生气了，工资卡余额提醒你冷静。"}
          </motion.div>
        )}
      </div>

      <div className="mt-12">
        <RetroButton 
          onClick={throwBei}
          disabled={isSpinning}
          className="text-3xl px-16 py-6 bg-retro-ink text-white hover:bg-retro-red"
        >
          {isSpinning ? "冥想中..." : "掷！"}
        </RetroButton>
      </div>
    </motion.div>
  );
};

