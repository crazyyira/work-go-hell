'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const ClockOutCountdown = () => {
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

