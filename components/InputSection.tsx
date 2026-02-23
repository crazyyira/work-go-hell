'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Trash2, Flame, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Complaint } from '@/lib/constants';
import { RetroButton } from './RetroButton';

interface InputSectionProps {
  complaints: Complaint[];
  complaintHistory: Complaint[];
  inputText: string;
  setInputText: (text: string) => void;
  addComplaint: () => void;
  isShredding: boolean;
  isBurning: boolean;
  isShredded: boolean;
  handleShred: () => void;
  handleBurn: () => void;
  startDivination: () => void;
}

export const InputSection = ({
  complaints,
  complaintHistory,
  inputText,
  setInputText,
  addComplaint,
  isShredding,
  isBurning,
  isShredded,
  handleShred,
  handleBurn,
  startDivination,
}: InputSectionProps) => {
  return (
    <motion.div 
      key="input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      {/* Input Section */}
      <div className="retro-border bg-white p-6 flex flex-col gap-4">
        <label className="text-2xl font-serif-heavy flex items-center gap-2">
          <Flame className="text-retro-red" /> 吐槽今日奇葩行为
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addComplaint()}
            placeholder="例如：老板又在画大饼了..."
            className="flex-1 border-b-2 border-retro-ink p-2 text-xl focus:outline-none bg-transparent"
          />
          <RetroButton onClick={addComplaint} className="p-2">
            <Send size={24} />
          </RetroButton>
        </div>
      </div>

      {/* Destruction Area */}
      <div className={cn(
        "relative flex flex-col items-center justify-center min-h-[450px] w-full overflow-hidden transition-all duration-300",
        (isShredding || isBurning) && "animate-shake-intense",
        isBurning && "fire-gradient-overlay"
      )}>
        {complaints.length > 0 && !isShredded && (
          <DestructionArea 
            complaint={complaints[0]}
            isShredding={isShredding}
            isBurning={isBurning}
          />
        )}

        {complaints.length === 0 && !isShredded && (
          <ComplaintHistory complaintHistory={complaintHistory} />
        )}

        {isShredded && <ShredSuccessMessage />}
      </div>

      <ActionButtons 
        complaints={complaints}
        isShredded={isShredded}
        isShredding={isShredding}
        isBurning={isBurning}
        handleShred={handleShred}
        handleBurn={handleBurn}
        startDivination={startDivination}
      />
    </motion.div>
  );
};

const DestructionArea = ({ 
  complaint, 
  isShredding, 
  isBurning 
}: { 
  complaint: Complaint;
  isShredding: boolean;
  isBurning: boolean;
}) => (
  <div className="relative w-full max-w-lg flex flex-col items-center">
    <motion.div
      animate={
        isShredding ? { y: 180, opacity: [1, 1, 0] } : 
        isBurning ? { 
          scale: [1, 1.2, 1.5, 0.8],
          rotate: [0, 5, -5, 10, -10, 0],
          opacity: [1, 1, 1, 0]
        } : { y: 0 }
      }
      transition={{ duration: isShredding ? 4.5 : 5, ease: "linear" }}
      className={cn(
        "sticky-note p-12 w-full text-center font-calligraphy text-6xl text-retro-red z-20 relative",
        isBurning && "animate-fire-intense"
      )}
    >
      <div className="paper-clip" />
      <span className={cn(isBurning && "animate-pulse")}>
        {complaint.text}
      </span>
      
      {isBurning && <FireParticles />}
    </motion.div>

    {isShredding && <ShredderMouth />}
  </div>
);

const FireParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: 60, x: Math.random() * 400 - 200, opacity: 1 }}
        animate={{ 
          y: -200, 
          x: Math.random() * 400 - 200,
          opacity: 0, 
          scale: [1, 3, 0.5],
          rotate: [0, 180]
        }}
        transition={{ duration: 1.5, delay: Math.random() * 3 }}
        className="absolute bottom-0 left-1/2 w-6 h-6 bg-orange-600 rounded-full blur-md"
      />
    ))}
  </div>
);

const ShredderMouth = () => (
  <>
    <div className="w-full h-20 bg-retro-ink mt-8 z-30 relative flex items-center justify-center border-t-8 border-retro-yellow/50">
      <div className="w-[95%] h-4 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          animate={{ x: [-40, 40] }}
          transition={{ repeat: Infinity, duration: 0.05 }}
          className="w-full h-full bg-white/10"
        />
      </div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-retro-yellow px-8 py-2 border-4 border-retro-ink font-retro text-lg uppercase tracking-widest shadow-2xl">
        焦虑粉碎中...
      </div>
    </div>

    <div className="absolute top-[220px] w-full flex justify-around px-4 z-10">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: [0, 350],
            opacity: [0, 1, 1, 0],
            rotate: [0, i % 2 === 0 ? 30 : -30]
          }}
          transition={{ 
            duration: 2, 
            delay: 0.8 + (i * 0.03),
            ease: "linear"
          }}
          className="w-2 h-40 bg-yellow-100 border-x border-retro-ink/20"
        />
      ))}
    </div>
  </>
);

const ComplaintHistory = ({ complaintHistory }: { complaintHistory: Complaint[] }) => {
  if (complaintHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center opacity-30 py-20">
        <Ghost size={80} />
        <p className="text-3xl mt-6 font-serif-heavy text-center">墙上空空如也，快来吐槽！</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto py-4 px-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {complaintHistory.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={cn(
              "p-4 text-center relative overflow-visible min-h-[100px] flex items-center justify-center transition-all",
              c.status === 'SHREDDED' && "knife-stabbed animate-knife-stab bg-yellow-50 border-2 border-retro-ink shadow-lg",
              c.status === 'BURNT' && "burnt-paper",
              !c.status && "sticky-note shadow-sm"
            )}
            style={{ 
              transform: c.status === 'SHREDDED' 
                ? `rotate(${c.rotation * 3}deg)` 
                : `rotate(${c.rotation * 2}deg)` 
            }}
          >
            <p className={cn(
              "font-calligraphy text-xl relative z-10",
              c.status === 'SHREDDED' && "text-retro-red font-bold",
              c.status === 'BURNT' && "burnt-text"
            )}>
              {c.text}
            </p>
            
            {/* 粉碎后的三把刀和血迹效果 */}
            {c.status === 'SHREDDED' && (
              <>
                <div className="knife knife-1" />
                <div className="knife knife-2" />
                <div className="knife knife-3" />
                <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-retro-red/30 rounded-full blur-sm" />
                <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-retro-red/20 rounded-full blur-sm" />
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-retro-red/25 rounded-full blur-sm" />
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-retro-red/20 rounded-full blur-sm" />
              </>
            )}
            
            {/* 烧焦的洞 */}
            {c.status === 'BURNT' && (
              <>
                <div className="burn-hole absolute top-2 right-3 w-6 h-6" />
                <div className="burn-hole absolute bottom-3 left-4 w-8 h-8" />
                <div className="burn-hole absolute top-1/2 right-1/4 w-4 h-4" />
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ShredSuccessMessage = () => (
  <motion.div 
    initial={{ scale: 0, rotate: -10 }}
    animate={{ scale: 1, rotate: 0 }}
    className="flex flex-col items-center gap-6"
  >
    <div className="w-32 h-32 bg-retro-red rounded-full flex items-center justify-center text-white shadow-2xl border-8 border-white">
      <Trash2 size={64} />
    </div>
    <div className="text-center">
      <p className="text-4xl font-serif-heavy text-retro-red mb-2">物理毁灭成功！</p>
      <p className="text-xl opacity-70">烦恼已成云烟，请神明降旨</p>
    </div>
  </motion.div>
);

const ActionButtons = ({
  complaints,
  isShredded,
  isShredding,
  isBurning,
  handleShred,
  handleBurn,
  startDivination,
}: {
  complaints: Complaint[];
  isShredded: boolean;
  isShredding: boolean;
  isBurning: boolean;
  handleShred: () => void;
  handleBurn: () => void;
  startDivination: () => void;
}) => (
  <div className="flex flex-wrap justify-center gap-6 mt-8">
    {complaints.length > 0 && !isShredded && !isShredding && !isBurning && (
      <>
        <RetroButton 
          onClick={handleShred}
          className="bg-retro-ink text-white text-2xl px-10 py-4 flex items-center gap-2 hover:bg-slate-800"
        >
          <Trash2 size={24} /> 咔嚓粉碎
        </RetroButton>
        <RetroButton 
          onClick={handleBurn}
          className="bg-retro-red text-white text-2xl px-10 py-4 flex items-center gap-2 hover:bg-red-700"
        >
          <Flame size={24} /> 焚烧殆尽
        </RetroButton>
      </>
    )}
    
    {(!isShredding && !isBurning) && (
      <RetroButton 
        onClick={startDivination}
        className={cn(
          "text-4xl px-16 py-6 transition-all",
          isShredded ? "bg-retro-yellow text-retro-ink animate-bounce" : "bg-retro-paper text-retro-ink opacity-50 hover:opacity-100"
        )}
      >
        {isShredded ? "请神指示" : "直接请示天意"}
      </RetroButton>
    )}
  </div>
);

