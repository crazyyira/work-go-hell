/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Send, 
  RefreshCw, 
  Share2, 
  Clock, 
  AlertTriangle,
  Flame,
  Coffee,
  Ghost,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants & Types ---

type DivinationResult = 'SHENG' | 'XIAO' | 'YIN'; // 圣杯 (Yes), 笑杯 (Maybe), 阴杯 (No)

interface Complaint {
  id: string;
  text: string;
  timestamp: number;
  rotation: number;
  status?: 'SHREDDED' | 'BURNT' | 'PENDING';
}

const RESULTS = {
  QUIT: {
    title: "辞职申请书",
    subtitle: "老子不干了！",
    stamp: "准予离职",
    color: "bg-retro-red text-white",
    divinationText: "圣杯：天意如此，神仙都劝你快跑。"
  },
  STAY: {
    title: "再忍五天暴击卡",
    subtitle: "为了五斗米折腰",
    stamp: "继续搬砖",
    color: "bg-retro-yellow text-retro-ink",
    divinationText: "阴杯：神仙生气了，工资卡余额提醒你冷静。"
  },
  MAYBE: {
    title: "赛博摸鱼许可证",
    subtitle: "带薪如厕，精神离职",
    stamp: "建议摸鱼",
    color: "bg-white text-retro-ink",
    divinationText: "笑杯：神仙笑而不语，可能觉得你还没穷够。"
  }
};

const ZHA_XIN_REPLIES = [
  "老板画的饼太大，胃动力不足，建议物理隔离。",
  "月薪 3000？这哪是上班，这是在做慈善，建议给自己颁发诺贝尔和平奖。",
  "同事太奇葩？那是他在帮你磨练心性，离修仙只差一个辞职信。",
  "别问了，你的福报在后面，大概在 65 岁退休那天。"
];

// --- Components ---

const RetroButton = ({ children, onClick, className, disabled }: { children: React.ReactNode, onClick?: () => void, className?: string, disabled?: boolean }) => (
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

const ClockOutCountdown = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const clockOut = new Date();
      clockOut.setHours(18, 0, 0, 0);
      
      if (now > clockOut) {
        setTimeLeft("已下班！快跑！");
      } else {
        const timeDiff = clockOut.getTime() - now.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}时${minutes}分${seconds}秒`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-sm bg-retro-ink text-retro-yellow px-3 py-1 rounded">
      <Clock size={14} />
      <span>下班倒计时: {timeLeft}</span>
    </div>
  );
};

export default function App() {
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
  const cardRef = useRef<HTMLDivElement>(null);

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

  const [isBurning, setIsBurning] = useState(false);

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
    }, 4500); // Longer duration
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
    }, 5000); // Even longer duration for burning
  };

  const startDivination = () => {
    // Allow divination even without a complaint
    if (complaints.length === 0) {
      setComplaints([{
        id: 'default',
        text: '心中所念之事',
        timestamp: Date.now(),
        rotation: 0
      }]);
      setIsShredded(true); // Skip destruction if no complaint entered
    } else if (!isShredded) {
      alert("请先粉碎或焚烧你的烦恼！");
      return;
    }
    setStep('DIVINATION');
  };

  const throwBei = () => {
    if (isSpinning || isConsulting) return;
    setIsSpinning(true);
    
    // Vibration feedback
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
        // Rhythm: delay after 3rd throw
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
        }, 1500); // 1.5s delay for "Consulting heaven..."
      }
    }, 800);
  };

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
      {/* --- Header --- */}
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
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              {/* --- Input Section --- */}
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

              {/* --- Destruction Area --- */}
              <div className={cn(
                "relative flex flex-col items-center justify-center min-h-[450px] w-full overflow-hidden transition-all duration-300",
                (isShredding || isBurning) && "animate-shake-intense",
                isBurning && "fire-gradient-overlay"
              )}>
                {complaints.length > 0 && !isShredded && (
                  <div className="relative w-full max-w-lg flex flex-col items-center">
                    {/* The Paper Strip */}
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
                        {complaints[0].text}
                      </span>
                      
                      {/* Fire particles for burning */}
                      {isBurning && (
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
                          {[...Array(30)].map((_, i) => (
                            <motion.div
                              key={`spark-${i}`}
                              initial={{ y: 60, x: Math.random() * 400 - 200, opacity: 1 }}
                              animate={{ 
                                y: -300, 
                                x: Math.random() * 600 - 300,
                                opacity: 0, 
                                scale: [1, 0.5]
                              }}
                              transition={{ duration: 1, delay: Math.random() * 4 }}
                              className="absolute bottom-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Shredder Mouth */}
                    {isShredding && (
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
                          
                          {/* Visual Sound Effects */}
                          <motion.div 
                            animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1], x: [-80, -100], y: [-20, -40] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                            className="absolute left-0 text-retro-yellow font-retro text-3xl italic font-bold"
                          >
                            咔嚓!
                          </motion.div>
                          <motion.div 
                            animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1], x: [80, 100], y: [20, 40] }}
                            transition={{ repeat: Infinity, duration: 0.25, delay: 0.1 }}
                            className="absolute right-0 text-retro-yellow font-retro text-3xl italic font-bold"
                          >
                            滋滋!
                          </motion.div>
                          <motion.div 
                            animate={{ opacity: [0, 1, 0], scale: [1, 2, 1], y: [-60, -80] }}
                            transition={{ repeat: Infinity, duration: 0.3, delay: 0.05 }}
                            className="absolute text-retro-red font-retro text-4xl italic font-black"
                          >
                            碎!
                          </motion.div>
                        </div>

                        {/* Shredded Strips */}
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
                    )}

                    {/* Burning visual */}
                    {isBurning && (
                      <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                        <motion.div 
                          animate={{ 
                            scale: [1, 2, 4, 0], 
                            opacity: [0, 1, 1, 0],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 5 }}
                          className="text-[12rem] font-serif-heavy text-retro-red drop-shadow-[0_0_50px_rgba(255,0,0,0.8)]"
                        >
                          焚!
                        </motion.div>
                        <motion.div 
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ duration: 5 }}
                          className="absolute inset-0 bg-retro-red/20 blur-3xl"
                        />
                      </div>
                    )}
                  </div>
                )}

                {complaints.length === 0 && !isShredded && (
                  <>
                    {complaintHistory.length > 0 ? (
                      <div className="w-full h-full overflow-y-auto py-4 px-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {complaintHistory.map((c) => (
                            <motion.div
                              key={c.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={cn(
                                "p-4 text-center relative overflow-hidden min-h-[100px] flex items-center justify-center transition-all",
                                c.status === 'SHREDDED' ? "bg-slate-200 opacity-50 grayscale border-2 border-dashed border-retro-ink/30" : 
                                c.status === 'BURNT' ? "bg-stone-300 opacity-40 grayscale border-2 border-dotted border-retro-ink/30" : 
                                "sticky-note shadow-sm"
                              )}
                              style={{ transform: `rotate(${c.rotation * 2}deg)` }}
                            >
                              <p className={cn(
                                "font-calligraphy text-xl",
                                c.status === 'SHREDDED' && "line-through decoration-retro-ink/30",
                                c.status === 'BURNT' && "opacity-50"
                              )}>
                                {c.text}
                              </p>
                              {c.status === 'SHREDDED' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-full h-px bg-retro-ink/20 rotate-12" />
                                  <div className="w-full h-px bg-retro-ink/20 -rotate-12" />
                                  <span className="bg-white/80 px-2 py-0.5 text-[10px] font-retro border border-retro-ink/20 rotate-12">已粉碎</span>
                                </div>
                              )}
                              {c.status === 'BURNT' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="absolute inset-0 bg-black/5" />
                                  <span className="bg-retro-red/80 text-white px-2 py-0.5 text-[10px] font-retro border border-white/20 -rotate-12">已焚毁</span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-30 py-20">
                        <Ghost size={80} />
                        <p className="text-3xl mt-6 font-serif-heavy text-center">墙上空空如也，快来吐槽！</p>
                      </div>
                    )}
                  </>
                )}

                {isShredded && (
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
                )}
              </div>

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
            </motion.div>
          )}

          {step === 'DIVINATION' && (
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
          )}

          {step === 'RESULT' && finalResult && (
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
                  <p className="text-3xl font-bold mb-6 italic">“ {RESULTS[finalResult].subtitle} ”</p>
                  
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
          )}
        </AnimatePresence>
      </main>

      {/* --- Footer --- */}
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
