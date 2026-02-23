'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DivinationResult } from '@/lib/constants';
import { RetroButton } from './RetroButton';

interface DivinationSectionProps {
  divinationCount: number;
  isSpinning: boolean;
  isConsulting: boolean;
  isLoadingAI: boolean;
  lastDivination: DivinationResult | null;
  divinationHistory: DivinationResult[];
  aiCardData: any;
  throwBei: () => void;
}

export const DivinationSection = ({
  divinationCount,
  isSpinning,
  isConsulting,
  isLoadingAI,
  lastDivination,
  divinationHistory,
  aiCardData,
  throwBei,
}: DivinationSectionProps) => {
  const getDivinationName = (result: DivinationResult) => {
    if (result === 'SHENG') return '圣杯';
    if (result === 'XIAO') return '笑杯';
    return '阴杯';
  };

  const getDivinationText = (result: DivinationResult, index: number) => {
    // 优先使用 AI 生成的文字
    if (aiCardData?.throwResults?.[index]?.text) {
      return aiCardData.throwResults[index].text;
    }
    
    // 如果还没有 AI 数据，显示"神灵显化中..."
    return '神灵显化中...';
  };

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

      {/* 历史记录 - 显示所有已完成的掷茭 */}
      {divinationHistory.length > 0 && (
        <div className="flex gap-4 mb-4">
          {divinationHistory.map((result, index) => {
            // 如果是当前正在显示的结果（最后一次且还在显示中），则不在历史记录中显示
            const isCurrentShowing = index === divinationCount - 1 && lastDivination !== null && !isConsulting && !isLoadingAI;
            if (isCurrentShowing) return null;
            
            return (
              <motion.div 
                key={index} 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="retro-border bg-white px-4 py-3 min-w-[120px]"
              >
                <p className="text-sm opacity-60">第 {index + 1} 次</p>
                <p className="text-lg font-serif-heavy text-retro-red mb-1">
                  {getDivinationName(result)}
                </p>
                {aiCardData?.throwResults?.[index]?.text && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs leading-tight opacity-80 mt-2"
                  >
                    {aiCardData.throwResults[index].text}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

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

        {lastDivination && !isSpinning && !isConsulting && !isLoadingAI && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[75%] text-2xl font-serif-heavy text-retro-red text-center w-[320px] z-50 bg-retro-paper/95 p-4 retro-border shadow-2xl"
          >
            <div className="text-sm italic opacity-60 mb-1 font-retro">—— 啪嗒! ——</div>
            <p className="text-xl mb-2">{getDivinationName(lastDivination)}</p>
            <p className="text-base opacity-80">{getDivinationText(lastDivination, divinationCount - 1)}</p>
          </motion.div>
        )}
      </div>

      {/* 大师解签中 - 显示在掷茭图片和按钮之间 */}
      {(isConsulting || isLoadingAI) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center bg-retro-paper/95 gap-4 p-8 retro-border shadow-2xl w-[400px]"
        >
          <Loader2 className="w-16 h-16 animate-spin text-retro-red" />
          <motion.p 
            className="text-4xl font-serif-heavy text-center"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            大师解签中
          </motion.p>
          <p className="text-xl opacity-70 text-center">请耐心等待</p>
        </motion.div>
      )}

      <div className="mt-12">
        <RetroButton 
          onClick={throwBei}
          disabled={isSpinning || isConsulting || isLoadingAI}
          className="text-3xl px-16 py-6 bg-retro-ink text-white hover:bg-retro-red"
        >
          {isSpinning ? "冥想中..." : isConsulting || isLoadingAI ? "占卜中..." : "掷！"}
        </RetroButton>
      </div>
    </motion.div>
  );
};

