'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EarningsCounterProps {
  totalAmount: number;
  startTime: Date;
  duration: number;
  withdrawn: number;
  onEarningsUpdate?: (earned: number, available: number) => void;
}

export function LiveEarningsCounter({
  totalAmount,
  startTime,
  duration,
  withdrawn,
  onEarningsUpdate,
}: EarningsCounterProps) {
  const [earned, setEarned] = useState(0);
  const [available, setAvailable] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - startTime.getTime();
      const elapsedSeconds = elapsedMs / 1000;
      const totalSeconds = duration;
      
      // Calculate progress percentage
      const progressPercent = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
      
      // Calculate earned amount
      const earnedAmount = Math.min((totalAmount * elapsedSeconds) / totalSeconds, totalAmount);
      
      // Calculate available to withdraw
      const availableAmount = Math.max(0, earnedAmount - withdrawn);

      setEarned(earnedAmount);
      setAvailable(availableAmount);
      setProgress(progressPercent);

      if (onEarningsUpdate) {
        onEarningsUpdate(earnedAmount, availableAmount);
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [totalAmount, startTime, duration, withdrawn, onEarningsUpdate]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  // Calculate per-second rate
  const perSecondRate = totalAmount / duration;
  const perHourRate = perSecondRate * 3600;
  const perDayRate = perSecondRate * 86400;

  return (
    <div className="space-y-4">
      {/* Main Counter */}
      <Card className="bg-[#0a0a0a] border-2 border-[#FFD600]/30">
        <CardHeader>
          <CardTitle className="text-lg text-white">Live Earnings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="text-5xl md:text-6xl font-bold text-[#FFD600] mb-2">
              {formatCurrency(earned)}
            </div>
            <p className="text-sm text-[#cccccc]">
              Streaming at {formatCurrency(perSecondRate)}/second
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-[#cccccc]">Stream Progress</span>
              <span className="text-xs font-medium text-[#FFD600]">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#FFD600] h-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
              <p className="text-xs text-[#cccccc] font-semibold mb-1">Per Hour</p>
              <p className="text-lg font-bold text-[#FFD600]">{formatCurrency(perHourRate)}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
              <p className="text-xs text-[#cccccc] font-semibold mb-1">Per Day</p>
              <p className="text-lg font-bold text-white">{formatCurrency(perDayRate)}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
              <p className="text-xs text-[#cccccc] font-semibold mb-1">Available</p>
              <p className="text-lg font-bold text-[#FFD600]">{formatCurrency(available)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
