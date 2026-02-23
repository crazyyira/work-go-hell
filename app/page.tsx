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
  const [divinationHistory, setDivinationHistory] = useState<DivinationResult[]>([]);
  const [finalResult, setFinalResult] = useState<keyof typeof RESULTS | null>(null);
  const [currentZhaXin, setCurrentZhaXin] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [aiCardData, setAiCardData] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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
      setDivinationHistory(prev => [...prev, res]);
      setIsSpinning(false);

      // 每次掷茭后都调用 AI 生成该次的解读
      fetchSingleThrowAI(res, nextCount - 1);

      if (nextCount === 3) {
        // 第三次掷茭后，等待 8 秒让用户充分阅读第三次结果，然后才开始生成最终结果
        setTimeout(() => {
          // 清除第三次结果显示，然后显示"大师解签中"
          setLastDivination(null);
          setIsConsulting(true);
          setIsLoadingAI(true);
          generateFinalResult([...divinationHistory, res]);
        }, 8000); // 等待 8 秒
      }
    }, 800);
  };

  // 为单次掷茭调用 AI
  const fetchSingleThrowAI = async (result: DivinationResult, index: number) => {
    console.log(`Fetching AI for throw ${index + 1}:`, result);
    
    try {
      const response = await fetch('/api/divination/single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result,
          index,
          complaint: complaints[0]?.text || '心中所念之事',
        }),
      });

      const data = await response.json();
      console.log(`Received AI data for throw ${index + 1}:`, data);
      
      // 更新该次掷茭的解读
      setAiCardData((prev: any) => {
        const newData = { ...prev };
        if (!newData.throwResults) {
          newData.throwResults = [];
        }
        newData.throwResults[index] = {
          result,
          text: data.text
        };
        return newData;
      });
    } catch (error) {
      console.error(`AI error for throw ${index + 1}:`, error);
      // 使用降级文案
      const fallbackText = getFallbackText(result);
      setAiCardData((prev: any) => {
        const newData = { ...prev };
        if (!newData.throwResults) {
          newData.throwResults = [];
        }
        newData.throwResults[index] = {
          result,
          text: fallbackText
        };
        return newData;
      });
    }
  };

  // 获取降级文案
  const getFallbackText = (result: DivinationResult): string => {
    const throwTexts = {
      SHENG: [
        '神仙点头了，这是要飞升的节奏！',
        '圣杯出现，老板听了会沉默，HR听了会流泪。',
        '一正一反，天意让你反了这个班！',
        '圣杯加持，辞职信已经在路上了。'
      ],
      YIN: [
        '两面朝天，神仙说：醒醒，房贷还没还完呢。',
        '阴杯警告，钱包提醒你要现实一点。',
        '神仙翻了个白眼：就你这存款还想辞职？',
        '阴杯示警，建议先攒够三年生活费再说。'
      ],
      XIAO: [
        '神仙笑了，可能在笑你还没穷够。',
        '笑杯出现，连神仙都觉得你在纠结什么。',
        '两面朝地，神仙说：要不先摸鱼试试？',
        '笑杯调侃，人生何必太认真，先摸鱼再说。'
      ]
    };
    const texts = throwTexts[result];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  // 生成最终结果
  const generateFinalResult = async (results: DivinationResult[]) => {
    try {
      const response = await fetch('/api/divination/final', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          complaint: complaints[0]?.text || '心中所念之事',
          divinationResults: results,
        }),
      });

      const data = await response.json();
      console.log('Received final result:', data);
      
      setAiCardData((prev: any) => ({
        ...prev,
        cardTitle: data.cardTitle,
        cardSubtitle: data.cardSubtitle,
        stamp: data.stamp,
        interpretation: data.interpretation,
        divinationText: data.divinationText,
        finalResult: data.finalResult,
      }));
      setFinalResult(data.finalResult);
      setCurrentZhaXin(data.interpretation);
      
      // 直接跳转，不要重置状态
      setStep('RESULT');
      setIsLoadingAI(false);
      setIsConsulting(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#cc3333', '#f1c40f', '#1a1a1a']
      });
    } catch (error) {
      console.error('Final result error:', error);
      useFallbackFinalResult(results);
    }
  };

  const useFallbackFinalResult = (results: DivinationResult[]) => {
    const shengCount = results.filter(r => r === 'SHENG').length;
    const yinCount = results.filter(r => r === 'YIN').length;

    let finalResultType: keyof typeof RESULTS = 'MAYBE';
    let cardTitle = '';
    let cardSubtitle = '';
    let stamp = '';
    let interpretation = '';
    let divinationText = '';

    if (shengCount >= 2) {
      finalResultType = 'QUIT';
      cardTitle = '辞职申请书';
      cardSubtitle = '老子不干了！';
      stamp = '准予离职';
      interpretation = '两次圣杯！神仙都在催你快跑，不辞职就做善事吧！';
      divinationText = '圣杯加持，天意如此，是时候追求自由了。';
    } else if (yinCount >= 2) {
      finalResultType = 'STAY';
      cardTitle = '再忍五天暴击卡';
      cardSubtitle = '为了五斗米折腰';
      stamp = '继续搬砖';
      interpretation = '两次阴杯，神仙劝你冷静。工资卡余额提醒你：梦想很贵。';
      divinationText = '阴杯示警，留得青山在，不怕没柴烧。';
    } else {
      finalResultType = 'MAYBE';
      cardTitle = '赛博摸鱼许可证';
      cardSubtitle = '精神离职，肉体打卡';
      stamp = '暂缓决定';
      interpretation = '结果混乱，说明时机未到。建议继续观望，顺便摸摸鱼。';
      divinationText = '天意未明，不如静观其变，该来的总会来。';
    }

    setAiCardData((prev: any) => ({
      ...prev,
      cardTitle,
      cardSubtitle,
      stamp,
      interpretation,
      divinationText,
      finalResult: finalResultType,
    }));
    setFinalResult(finalResultType);
    setCurrentZhaXin(interpretation);
    
    // 直接跳转
    setStep('RESULT');
    setIsLoadingAI(false);
    setIsConsulting(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#cc3333', '#f1c40f', '#1a1a1a']
    });
  };

  const reset = () => {
    setStep('INPUT');
    setDivinationCount(0);
    setLastDivination(null);
    setDivinationHistory([]);
    setFinalResult(null);
    setComplaints([]);
    setIsShredded(false);
    setAiCardData(null);
  };

  const continueComplaining = () => {
    setStep('INPUT');
    setDivinationCount(0);
    setLastDivination(null);
    setDivinationHistory([]);
    setFinalResult(null);
    setComplaints([]);
    setIsShredded(false);
    setAiCardData(null);
  };

  const resetToInput = () => {
    setComplaints([]);
    setIsShredded(false);
    setInputText("");
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
              resetToInput={resetToInput}
            />
          )}

          {step === 'DIVINATION' && (
            <DivinationSection
              divinationCount={divinationCount}
              isSpinning={isSpinning}
              isConsulting={isConsulting}
              isLoadingAI={isLoadingAI}
              lastDivination={lastDivination}
              divinationHistory={divinationHistory}
              aiCardData={aiCardData}
              throwBei={throwBei}
            />
          )}

          {step === 'RESULT' && finalResult && (
            <ResultSection
              finalResult={finalResult}
              currentZhaXin={currentZhaXin}
              complaints={complaints}
              aiCardData={aiCardData}
              divinationHistory={divinationHistory}
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

