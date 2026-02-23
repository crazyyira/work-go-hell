'use client';

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Download, RefreshCw, Flame, AlertTriangle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';
import { RESULTS, Complaint } from '@/lib/constants';
import { RetroButton } from './RetroButton';

interface ResultSectionProps {
  finalResult: keyof typeof RESULTS;
  currentZhaXin: string;
  complaints: Complaint[];
  continueComplaining: () => void;
  reset: () => void;
}

export const ResultSection = ({
  finalResult,
  currentZhaXin,
  complaints,
  continueComplaining,
  reset,
}: ResultSectionProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `辞职决定-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };

  return (
    <motion.div 
      key="result"
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      className="flex flex-col items-center gap-8 py-8"
    >
      <div 
        ref={cardRef}
        className={cn(
          "retro-border-double w-full max-w-md p-8 flex flex-col gap-6 relative overflow-hidden bg-retro-paper",
          RESULTS[finalResult].color
        )}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        
        <div className="border-4 border-current p-6 flex flex-col items-center text-center">
          <h3 className="text-6xl font-serif-heavy mb-2 tracking-tighter">{RESULTS[finalResult].title}</h3>
          <div className="w-full h-1.5 bg-current mb-6" />
          <p className="text-3xl font-bold mb-6 italic">&quot; {RESULTS[finalResult].subtitle} &quot;</p>
          
          <div className="sticky-note p-6 mb-6 w-full text-left relative">
            <p className="text-xs uppercase opacity-60 mb-2 tracking-widest">您的吐槽：</p>
            <p className="text-4xl font-calligraphy leading-tight text-retro-red drop-shadow-sm -rotate-1">
              {complaints[0]?.text || "无声的抗议"}
            </p>
            <div className="absolute top-2 right-2 opacity-20">
              <AlertTriangle size={24} />
            </div>
          </div>

          <p className="text-2xl leading-relaxed font-retro mb-6 px-4">
            {currentZhaXin}
          </p>
          
          <div className="w-full h-px bg-current/30 mb-6" />
          
          <p className="text-base opacity-90 italic font-serif-heavy">
            {RESULTS[finalResult].divinationText}
          </p>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="text-xs font-mono opacity-70">
            日期：{new Date().toLocaleDateString()}<br />
            编号：OFFER-{Math.floor(Math.random() * 10000)}<br />
            <span className="mt-2 block font-retro">本结果由「职场速效救心丸」提供</span>
          </div>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-retro-red rounded-full opacity-40 animate-pulse" />
            <div className="w-24 h-24 border-4 border-retro-red rounded-full flex items-center justify-center -rotate-12 animate-stamp">
              <span className="text-retro-red font-serif-heavy text-2xl text-center leading-none px-2">
                {RESULTS[finalResult].stamp}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <RetroButton onClick={downloadCard} className="flex items-center gap-2">
          <Download size={20} /> 保存为图片
        </RetroButton>
        <RetroButton onClick={continueComplaining} className="flex items-center gap-2 bg-retro-yellow">
          <Flame size={20} /> 继续吐槽
        </RetroButton>
        <RetroButton onClick={reset} className="flex items-center gap-2 bg-white">
          <RefreshCw size={20} /> 重新占卜
        </RetroButton>
      </div>
    </motion.div>
  );
};

