'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCeloFlowActions, useCeloFlowData, useCeloWallet } from '@/lib/useCeloFlow';
import { TrendingUp, AlertCircle, Info, Zap } from 'lucide-react';

export default function EmployeeDashboardPage() {
  const { isConnected, isWrongNetwork } = useCeloWallet();
  const { employeeStreams, refetchAll, isLoading } = useCeloFlowData();
  const { withdraw } = useCeloFlowActions();

  const [pendingWithdrawId, setPendingWithdrawId] = useState<bigint | null>(null);

  const interactionDisabled = !isConnected || isWrongNetwork;

  useEffect(() => {
    if (!isConnected || isWrongNetwork) return;

    const interval = setInterval(() => {
      void refetchAll();
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, isWrongNetwork, refetchAll]);

  const totalAvailable = useMemo(
    () => employeeStreams.reduce((acc, stream) => acc + stream.available, BigInt(0)),
    [employeeStreams],
  );

  const handleWithdraw = async (streamId: bigint, available: bigint) => {
    if (interactionDisabled) return;

    if (available <= BigInt(0)) {
      toast.error('Nothing available to withdraw');
      return;
    }

    try {
      setPendingWithdrawId(streamId);
      await withdraw(streamId);
      await refetchAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Withdraw failed';
      if (message.toLowerCase().includes('rejected')) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error(message);
      }
    } finally {
      setPendingWithdrawId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#1a1a1a] bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Employee Section</h1>
            <p className="text-sm text-[#cccccc]">Live earnings and withdrawals</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" className="border-[#1a1a1a]">Back</Button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {isWrongNetwork && (
          <Card className="border border-red-500/40 bg-red-500/10">
            <CardContent className="pt-6 flex items-center gap-3 text-sm text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Wrong network detected. Please switch to Celo Alfajores (Chain ID 44787).
            </CardContent>
          </Card>
        )}

        {/* Info Tips */}
        <Card className="border border-blue-500/30 bg-blue-500/10">
          <CardContent className="pt-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-blue-200">
              <p className="font-semibold">💡 How It Works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Your salary streams payments per second - watch it grow in real-time</li>
                <li>Available amount is what you can withdraw right now</li>
                <li>Withdraw anytime, no restrictions or penalties</li>
                <li>Funds go directly to your connected wallet</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="border border-[#FFD600]/30 bg-gradient-to-r from-[#FFD600]/10 to-transparent hover:border-[#FFD600]/50 transition-colors cursor-help">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-[#FFD600]" />
                  <span>Live Earnings</span>
                  <span className="text-xs font-normal text-[#cccccc]">(updates every second)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-[#FFD600] mb-2">
                  {Number(formatEther(totalAvailable)).toFixed(6)} CELO
                </p>
                <p className="text-sm text-[#999999]">Ready to withdraw</p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>Amount you've earned so far and can withdraw anytime</TooltipContent>
        </Tooltip>

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Your Salary Streams
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-[#cccccc] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>All active and cancelled salary streams</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : employeeStreams.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <TrendingUp className="w-12 h-12 mx-auto text-[#cccccc]/30" />
                <p className="text-sm text-[#cccccc]">No salary streams yet</p>
                <p className="text-xs text-[#999999]">Your employer will create streams for you</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">Total Amount</span>
                          </TooltipTrigger>
                          <TooltipContent>Total CELO to be paid</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">Duration</span>
                          </TooltipTrigger>
                          <TooltipContent>How long the stream runs</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">Withdrawn</span>
                          </TooltipTrigger>
                          <TooltipContent>Already withdrawn</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">Available</span>
                          </TooltipTrigger>
                          <TooltipContent>Ready to withdraw now</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeStreams.map((stream) => (
                      <TableRow key={stream.id.toString()} className="hover:bg-[#0a0a0a]/50">
                        <TableCell className="font-mono text-sm">{stream.id.toString()}</TableCell>
                        <TableCell className="font-mono text-xs">{`${stream.employer.slice(0, 6)}...${stream.employer.slice(-4)}`}</TableCell>
                        <TableCell className="font-semibold">{Number(formatEther(stream.totalAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-xs">{(Number(stream.duration) / 86400).toFixed(1)}d</TableCell>
                        <TableCell>{Number(formatEther(stream.withdrawnAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-[#FFD600] font-bold text-sm">
                          {Number(formatEther(stream.available)).toFixed(6)}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${stream.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {stream.isActive ? '🟢 Active' : '⭕ Stopped'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className={`${
                              stream.available <= BigInt(0) || !stream.isActive || interactionDisabled
                                ? 'bg-[#FFD600]/30 text-[#FFD600]/50'
                                : 'bg-[#FFD600] hover:bg-[#FFD600]/90 text-black'
                            } font-bold text-xs`}
                            disabled={
                              interactionDisabled ||
                              !stream.isActive ||
                              stream.available <= BigInt(0) ||
                              pendingWithdrawId === stream.id
                            }
                            onClick={() => handleWithdraw(stream.id, stream.available)}
                          >
                            {pendingWithdrawId === stream.id ? (
                              <>
                                <Spinner className="w-3 h-3 mr-1" />
                                Withdrawing...
                              </>
                            ) : (
                              '💰 Withdraw'
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
