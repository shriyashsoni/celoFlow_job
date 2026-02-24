'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowDownCircle, ArrowLeft } from 'lucide-react';
import { useSalaryStream } from '@/hooks/use-salary-stream';
import { LiveEarningsCounter } from '@/components/live-earnings-counter';
import { formatAddress } from '@/lib/wallet';

interface Stream {
  id: number;
  employer: string;
  totalAmount: number;
  available: number;
  withdrawn: number;
  startTime: Date;
  duration: number;
}

interface EmployeeDashboardProps {
  address: string;
  onDisconnect: () => void;
  onBack: () => void;
}

export function EmployeeDashboard({ address, onDisconnect, onBack }: EmployeeDashboardProps) {
  const { withdraw, isLoading: contractLoading, error } = useSalaryStream();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<number | null>(null);
  const [liveEarnings, setLiveEarnings] = useState<{ [key: number]: number }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Simulate live earnings updates
  useEffect(() => {
    if (streams.length === 0) return;

    const interval = setInterval(() => {
      const updated: { [key: number]: number } = {};
      
      streams.forEach((stream) => {
        const elapsedSeconds = (Date.now() - stream.startTime.getTime()) / 1000;
        const totalSeconds = stream.duration;
        const progress = Math.min(elapsedSeconds / totalSeconds, 1);
        const earned = stream.totalAmount * progress;
        updated[stream.id] = earned;
      });

      setLiveEarnings(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [streams]);

  useEffect(() => {
    if (error) {
      alert('Error: ' + error);
    }
  }, [error]);

  // Mock data
  useEffect(() => {
    setStreams([
      {
        id: 1,
        employer: '0xabcdef123456',
        totalAmount: 3000,
        startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        duration: 30 * 24 * 60 * 60,
        withdrawn: 500,
        available: 0
      },
      {
        id: 2,
        employer: '0x987654fedcba',
        totalAmount: 5000,
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duration: 60 * 24 * 60 * 60,
        withdrawn: 0,
        available: 0
      }
    ]);
  }, []);

  const handleWithdraw = async (streamId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }

    setSelectedStream(streamId);

    try {
      const result = await withdraw(streamId);
      
      if (result?.success) {
        setSuccessMessage(`Withdrawal successful! Transaction: ${result.transactionHash}`);
        
        setStreams(streams.map(s => 
          s.id === streamId 
            ? { ...s, withdrawn: s.withdrawn + s.available, available: 0 }
            : s
        ));
        
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        alert('Failed to withdraw');
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Failed to withdraw');
    } finally {
      setSelectedStream(null);
    }
  };

  const totalEarned = Object.values(liveEarnings).reduce((sum, val) => sum + val, 0);
  const totalWithdrawn = streams.reduce((sum, s) => sum + s.withdrawn, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-black/95 backdrop-blur">
        <div className="w-full px-4 sm:px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4 hover:bg-[#0a0a0a]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Your Salary Streams</h1>
            <p className="text-sm text-[#cccccc]">Watch your earnings grow in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-mono text-[#cccccc] hidden sm:block">
              {formatAddress(address)}
            </div>
            <Button variant="outline" size="sm" onClick={onDisconnect} className="border-[#1a1a1a] hover:bg-[#0a0a0a]">
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        {successMessage && (
          <div className="mb-6 p-4 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-lg">
            <p className="text-sm text-[#FFD600]">{successMessage}</p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-6">
              <div className="text-sm text-[#cccccc] mb-1">Total Earned</div>
              <div className="text-3xl font-bold text-[#FFD600]">
                ${(totalEarned + totalWithdrawn).toFixed(2)}
              </div>
              <div className="text-xs text-[#cccccc] mt-2">
                {streams.length} active streams
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-6">
              <div className="text-sm text-[#cccccc] mb-1">Live Earnings</div>
              <div className="text-3xl font-bold text-white">
                ${totalEarned.toFixed(2)}
              </div>
              <div className="text-xs text-[#cccccc] mt-2">
                Earning per second
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-6">
              <div className="text-sm text-[#cccccc] mb-1">Withdrawn</div>
              <div className="text-3xl font-bold text-[#FFD600]">
                ${totalWithdrawn.toFixed(2)}
              </div>
              <div className="text-xs text-[#cccccc] mt-2">
                All time
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streams */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Salary Streams</h2>
            <p className="text-[#cccccc]">Manage and withdraw from your active salary streams</p>
          </div>

          {streams.length === 0 ? (
            <Card className="border-[#1a1a1a] bg-[#0a0a0a]/50">
              <CardContent className="pt-12 text-center">
                <div className="text-[#cccccc] mb-4">No active streams</div>
                <p className="text-sm text-[#cccccc]">Awaiting salary stream creation from your employer</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {streams.map((stream) => {
                const earned = liveEarnings[stream.id] || 0;
                const available = earned - stream.withdrawn;
                const progress = ((earned + stream.withdrawn) / stream.totalAmount) * 100;

                return (
                  <Card 
                    key={stream.id} 
                    className="border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors"
                  >
                    <CardContent className="pt-8">
                      {/* Live Earnings Counter */}
                      <LiveEarningsCounter 
                        totalAmount={stream.totalAmount}
                        startTime={stream.startTime}
                        duration={stream.duration}
                        withdrawn={stream.withdrawn}
                      />

                      {/* Employer Info */}
                      <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
                        <div className="text-sm text-[#cccccc] mb-2">From</div>
                        <div className="font-mono text-sm truncate">{stream.employer}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-[#cccccc]">Progress</span>
                          <span className="text-sm text-[#FFD600]">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#FFD600] h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        onClick={() => handleWithdraw(stream.id)}
                        disabled={available <= 0 || contractLoading || selectedStream === stream.id}
                        size="lg"
                        className="w-full mt-6 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold"
                      >
                        {selectedStream === stream.id && contractLoading ? (
                          <>
                            <Spinner className="w-4 h-4 mr-2" />
                            Withdrawing...
                          </>
                        ) : (
                          <>
                            <ArrowDownCircle className="w-5 h-5 mr-2" />
                            Withdraw ${available.toFixed(2)}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
