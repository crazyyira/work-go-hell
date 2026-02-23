'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Coffee, AlertTriangle } from 'lucide-react';
import { ClockOutCountdown } from '@/components/ClockOutCountdown';
import { InputSection } from '@/components/InputSection';
import { DivinationSection } from '@/components/DivinationSection';
import { ResultSection } from '@/components/ResultSection';
import { Complaint, DivinationResult, RESULTS, ZHA_XIN_REPLIES } from '@/lib/constants';

export default function Home() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintHistory, setComplaintHistory] = useState<Complaint[]>([]);
  const [inputText, setInputText] = useState("");
  const [step, setStep] = useState<'INPUT' | 'DIVINATION' | 'RESULT'>('INPUT');
  const [isShredding, setIsShredding] = useState(false);
  const [isShredded, setIsShredded] = useState(false);
  const [divinationCount, setDivinationCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [lastDivination, setLastDivination] = useState<DivinationResult | null>(null);
  const [finalResult, setFinalResult] = useState<keyof typeof RESULTS | null>(null);
  const [currentZhaXin, setCurrentZhaXin] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const addComplaint = () => {
    if (!inputText.trim()) return;
    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText,
      timestamp: Date.now(),
      rotation: Math.random() * 4 - 2,
      status: 'PENDING'
    };
    setComplaints([newComplaint]);
    setComplaintHistory(prev => [newComplaint, ...prev]);
    setInputText("");
    setIsShredded(false);
  };

  const handleShred = () => {
    if (complaints.length === 0) return;
    setIsShredding(true);
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50, 30, 100, 50, 100, 50, 200]);
    }
    setTimeout(() => {
      setIsShredding(false);
      setIsShredded(true);
      setComplaintHistory(prev => prev.map(c => 
        c.id === complaints[0].id ? { ...c, status: 'SHREDDED' } : c
      ));
    }, 4500);
  };

  const handleBurn = () => {
    if (complaints.length === 0) return;
    setIsBurning(true);
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 200, 50, 300, 50, 500]);
    }
    setTimeout(() => {
      setIsBurning(false);
      setIsShredded(true);
      setComplaintHistory(prev => prev.map(c => 
        c.id === complaints[0].id ? { ...c, status: 'BURNT' } : c
      ));
    }, 5000);
  };

  const startDivination = () => {
    if (complaints.length === 0) {
      setComplaints([{
        id: 'default',
        text: '心中所念之事',
        timestamp: Date.now(),
        rotation: 0
      }]);
      setIsShredded(true);
    } else if (!isShredded) {
      alert("请先粉碎或焚烧你的烦恼！");
      return;
    }
    setStep('DIVINATION');
  };

  const throwBei = () => {
    if (isSpinning || isConsulting) return;
    setIsSpinning(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }

    setTimeout(() => {
      const results: DivinationResult[] = ['SHENG', 'XIAO', 'YIN'];
      const res = results[Math.floor(Math.random() * results.length)];
      setLastDivination(res);
      const nextCount = divinationCount + 1;
      setDivinationCount(nextCount);
      setIsSpinning(false);

      if (nextCount === 3) {
        setIsConsulting(true);
        setTimeout(() => {
          const outcomes: (keyof typeof RESULTS)[] = ['QUIT', 'STAY', 'MAYBE'];
          setFinalResult(outcomes[Math.floor(Math.random() * outcomes.length)]);
          setCurrentZhaXin(ZHA_XIN_REPLIES[Math.floor(Math.random() * ZHA_XIN_REPLIES.length)]);
          setStep('RESULT');
          setIsConsulting(false);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#cc3333', '#f1c40f', '#1a1a1a']
          });
        }, 1500);
      }
    }, 800);
  };

  const reset = () => {
    setStep('INPUT');
    setDivinationCount(0);
    setLastDivination(null);
    setFinalResult(null);
    setComplaints([]);
    setIsShredded(false);
  };

  const continueComplaining = () => {
    setStep('INPUT');
    setDivinationCount(0);
    setLastDivination(null);
    setFinalResult(null);
    setComplaints([]);
    setIsShredded(false);
  };

  return (
    <div className="min-h-screen newspaper-grid p-4 md:p-8 flex flex-col items-center relative">
      <div className="noise" />
      
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b-4 border-retro-ink pb-4">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-serif-heavy uppercase tracking-tighter retro-text-shadow">
            职场速效救心丸
          </h1>
          <p className="font-retro text-xl mt-2 italic opacity-80">—— 辞职还是搬砖？上天自有公论 ——</p>
        </div>
        <ClockOutCountdown />
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col gap-8">
        <AnimatePresence mode="wait">
          {step === 'INPUT' && (
            <InputSection
              complaints={complaints}
              complaintHistory={complaintHistory}
              inputText={inputText}
              setInputText={setInputText}
              addComplaint={addComplaint}
              isShredding={isShredding}
              isBurning={isBurning}
              isShredded={isShredded}
              handleShred={handleShred}
              handleBurn={handleBurn}
              startDivination={startDivination}
            />
          )}

          {step === 'DIVINATION' && (
            <DivinationSection
              divinationCount={divinationCount}
              isSpinning={isSpinning}
              isConsulting={isConsulting}
              lastDivination={lastDivination}
              throwBei={throwBei}
            />
          )}

          {step === 'RESULT' && finalResult && (
            <ResultSection
              finalResult={finalResult}
              currentZhaXin={currentZhaXin}
              complaints={complaints}
              continueComplaining={continueComplaining}
              reset={reset}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-4xl mt-12 pt-8 border-t-4 border-retro-ink flex flex-col md:flex-row justify-between items-center gap-4 opacity-60 text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Coffee size={14} /> 搬砖不易</span>
          <span className="flex items-center gap-1"><AlertTriangle size={14} /> 仅供娱乐</span>
        </div>
        <p>© 2026 职场速效救心丸研究所 | 拒绝内耗，从我做起</p>
      </footer>
    </div>
  );
}

