'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatEther } from 'viem';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MetaMaskConnectButton } from '@/components/metamask-connect-button';
import { WalletDetector } from '@/components/wallet-detector';
import { StreamSearch } from '@/components/stream-search';
import { ExportStreamsData } from '@/components/export-streams';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCeloFlowActions, useCeloFlowData, useCeloWallet } from '@/lib/useCeloFlow';
import { TrendingUp, AlertCircle, Info, Zap, DollarSign, RefreshCw, Wallet, Clock } from 'lucide-react';
import '@/styles/animations.css';

export default function EmployeeDashboardPage() {
  const { isConnected, isWrongNetwork, celoBalance } = useCeloWallet();
  const { employeeStreams, refetchAll, isLoading } = useCeloFlowData();
  const { withdraw } = useCeloFlowActions();

  const [pendingWithdrawId, setPendingWithdrawId] = useState<bigint | null>(null);
  const [filteredStreams, setFilteredStreams] = useState(employeeStreams);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    [employeeStreams]
  );

  const totalWithdrawn = useMemo(
    () => employeeStreams.reduce((acc, stream) => acc + stream.withdrawnAmount, BigInt(0)),
    [employeeStreams]
  );

  const totalAmount = useMemo(
    () => employeeStreams.reduce((acc, stream) => acc + stream.totalAmount, BigInt(0)),
    [employeeStreams]
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
      toast.success('✓ Withdrawal successful! Check your wallet.');
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchAll();
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          border-color: #FFD600 !important;
        }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          background-color: rgba(255, 214, 0, 0.05);
          transform: scale(1.02);
        }
        .pulse-subtle {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <header className="border-b border-[#1a1a1a] bg-gradient-to-r from-black via-black to-[#0a0a0a] backdrop-blur sticky top-0 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#FFD600] bg-clip-text text-transparent">
              💰 Employee Dashboard
            </h1>
            <p className="text-sm text-[#cccccc] mt-1">Track earnings and withdraw your salary</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              className="border-[#1a1a1a] hover:bg-[#0a0a0a]"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-[#1a1a1a] hover:bg-[#0a0a0a]">
                ← Home
              </Button>
            </Link>
            <MetaMaskConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        <WalletDetector />

        {isWrongNetwork && (
          <Card className="border border-red-500/40 bg-red-500/10 animate-pulse">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="text-sm text-red-300">
                Wrong network. Please switch to Celo Alfajores (Chain ID 44787).
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Tips */}
        <Card className="border border-blue-500/30 bg-blue-500/10 hover-lift">
          <CardContent className="pt-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-blue-200">
              <p className="font-semibold">💡 How It Works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Your salary streams continuously - watch earnings grow per second</li>
                <li>Available amount is what you can withdraw right now</li>
                <li>Withdraw anytime, no restrictions or penalties</li>
                <li>Funds go directly to your connected wallet instantly</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Live Earnings Card */}
        {employeeStreams.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border border-[#FFD600]/50 bg-gradient-to-r from-[#FFD600]/15 via-[#FFD600]/10 to-transparent hover-lift cursor-help">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Zap className="w-6 h-6 text-[#FFD600] animate-float" />
                    <span>Live Earnings</span>
                    <span className="text-xs font-normal text-[#cccccc]">(updates every second)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-6xl font-bold text-[#FFD600] mb-2 animate-pulse">
                    {Number(formatEther(totalAvailable)).toFixed(6)}
                  </p>
                  <p className="text-sm text-[#999999]">CELO ready to withdraw</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Amount you've earned so far and can withdraw anytime. Updates every second!</TooltipContent>
          </Tooltip>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Your Balance */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <Wallet className="w-3 h-3" /> Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#FFD600]">{Number(celoBalance).toFixed(3)}</p>
                  <p className="text-xs text-[#999999] mt-1">CELO in wallet</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Your current CELO wallet balance</TooltipContent>
          </Tooltip>

          {/* Total Earned */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Total Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{Number(formatEther(totalAmount)).toFixed(4)}</p>
                  <p className="text-xs text-[#999999] mt-1">allocation</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Total amount allocated in your streams</TooltipContent>
          </Tooltip>

          {/* Already Withdrawn */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Withdrawn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-400">{Number(formatEther(totalWithdrawn)).toFixed(4)}</p>
                  <p className="text-xs text-[#999999] mt-1">all-time</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Total CELO you've withdrawn so far</TooltipContent>
          </Tooltip>

          {/* Active Streams */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">{employeeStreams.filter((s) => s.isActive).length}</p>
                  <p className="text-xs text-[#999999] mt-1">streams</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Streams currently paying you</TooltipContent>
          </Tooltip>
        </div>

        {/* Streams Table */}
        <Card className="border-[#1a1a1a] bg-[#0a0a0a] hover-lift">
          <CardHeader className="bg-gradient-to-r from-[#FFD600]/10 to-transparent flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📊 Your Salary Streams
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-[#cccccc] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>All your active and cancelled salary streams. Withdraw available amount anytime.</TooltipContent>
              </Tooltip>
            </CardTitle>
            {employeeStreams.length > 0 && <ExportStreamsData streams={employeeStreams} filename="my-salary-streams.csv" />}
          </CardHeader>
          <CardContent className="pt-6">
            {employeeStreams.length > 0 && <StreamSearch streams={employeeStreams} onFilter={setFilteredStreams} placeholder="Search your streams..." />}

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : employeeStreams.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <TrendingUp className="w-12 h-12 mx-auto text-[#cccccc]/30" />
                <p className="text-sm text-[#cccccc]">No salary streams yet</p>
                <p className="text-xs text-[#999999]">Your employer will create streams for you. Sit back and watch your earnings grow!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>ID</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Withdrawn</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStreams.map((stream) => (
                      <TableRow key={stream.id.toString()} className="hover:bg-[#0a0a0a]/50 transition-colors">
                        <TableCell className="font-mono text-sm">{stream.id.toString()}</TableCell>
                        <TableCell className="font-mono text-xs">{`${stream.employer.slice(0, 6)}...${stream.employer.slice(-4)}`}</TableCell>
                        <TableCell className="font-semibold">{Number(formatEther(stream.totalAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-xs">{(Number(stream.duration) / 86400).toFixed(1)}d</TableCell>
                        <TableCell>{Number(formatEther(stream.withdrawnAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-[#FFD600] font-bold text-sm">
                          {Number(formatEther(stream.available)).toFixed(6)}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2 py-1 rounded transition-all ${stream.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {stream.isActive ? '🟢 Active' : '⭕ Stopped'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className={`${
                              stream.available <= BigInt(0) || !stream.isActive || interactionDisabled
                                ? 'bg-[#FFD600]/30 text-[#FFD600]/50 cursor-not-allowed'
                                : 'bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold'
                            } text-xs transition-all duration-300`}
                            disabled={
                              interactionDisabled || !stream.isActive || stream.available <= BigInt(0) || pendingWithdrawId === stream.id
                            }
                            onClick={() => handleWithdraw(stream.id, stream.available)}
                          >
                            {pendingWithdrawId === stream.id ? (
                              <>
                                <Spinner className="w-3 h-3 mr-1" />
                                Processing...
                              </>
                            ) : (
                              '💸 Withdraw'
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
