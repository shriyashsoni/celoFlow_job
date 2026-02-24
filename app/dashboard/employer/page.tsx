'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { isAddress, formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
import { Info, AlertCircle, CheckCircle2, Clock, TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';
import '@/styles/animations.css';

const toDateTime = (seconds: bigint) => {
  if (!seconds || seconds <= BigInt(0)) return '-';
  return new Date(Number(seconds) * 1000).toLocaleString();
};

export default function EmployerDashboardPage() {
  const { isConnected, isWrongNetwork, celoBalance } = useCeloWallet();
  const { employerStreams, refetchAll, isLoading } = useCeloFlowData();
  const { createStream, cancelStream } = useCeloFlowActions();

  const [employeeAddress, setEmployeeAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<bigint | null>(null);
  const [filteredStreams, setFilteredStreams] = useState(employerStreams);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const interactionDisabled = !isConnected || isWrongNetwork;

  const totalActive = useMemo(() => employerStreams.filter((stream) => stream.isActive).length, [employerStreams]);
  const totalStreaming = useMemo(
    () => formatEther(employerStreams.reduce((sum, s) => sum + s.totalAmount, BigInt(0))),
    [employerStreams]
  );
  const totalWithdrawn = useMemo(
    () => formatEther(employerStreams.reduce((sum, s) => sum + s.withdrawnAmount, BigInt(0))),
    [employerStreams]
  );

  const handleCreate = async () => {
    if (interactionDisabled) return;

    if (!employeeAddress || !salary || !durationSeconds) {
      toast.error('Please fill all input fields');
      return;
    }

    if (!isAddress(employeeAddress)) {
      toast.error('Invalid employee wallet address');
      return;
    }

    if (Number(salary) <= 0) {
      toast.error('Salary must be greater than zero');
      return;
    }

    if (Number(durationSeconds) <= 0) {
      toast.error('Duration must be greater than zero');
      return;
    }

    try {
      setIsCreating(true);
      await createStream({
        employee: employeeAddress,
        durationSeconds: Number(durationSeconds),
        salaryEth: salary,
      });
      setEmployeeAddress('');
      setSalary('');
      setDurationSeconds('');
      await refetchAll();
      toast.success('✨ Stream created successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create stream';
      if (message.toLowerCase().includes('rejected')) {
        toast.error('Transaction rejected by user');
      } else if (message.toLowerCase().includes('insufficient')) {
        toast.error('Insufficient CELO balance');
      } else {
        toast.error(message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = async (streamId: bigint) => {
    if (interactionDisabled) return;

    try {
      setPendingCancelId(streamId);
      await cancelStream(streamId);
      await refetchAll();
      toast.success('✓ Stream cancelled successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel stream';
      if (message.toLowerCase().includes('rejected')) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error(message);
      }
    } finally {
      setPendingCancelId(null);
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
        @keyframes pulse-light {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
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
      `}</style>

      <header className="border-b border-[#1a1a1a] bg-gradient-to-r from-black via-black to-[#0a0a0a] backdrop-blur sticky top-0 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#FFD600] bg-clip-text text-transparent">
              💼 Employer Dashboard
            </h1>
            <p className="text-sm text-[#cccccc] mt-1">Create and manage salary streams</p>
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
            <ConnectButton />
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
              <p className="font-semibold">💡 Quick Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Set salary amount in CELO tokens (you need balance to create streams)</li>
                <li>Employees can withdraw available amount anytime</li>
                <li>Cancel streams anytime to stop further payments</li>
                <li>View all your active and cancelled streams below</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Your Balance */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    Balance <Info className="w-3 h-3" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#FFD600]">{Number(celoBalance).toFixed(3)}</p>
                  <p className="text-xs text-[#999999] mt-1">CELO available</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Your CELO balance for creating new streams</TooltipContent>
          </Tooltip>

          {/* Total Streams */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <Users className="w-3 h-3" /> Total Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{employerStreams.length}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>All salary streams created (active + cancelled)</TooltipContent>
          </Tooltip>

          {/* Active Streams */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">{totalActive}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Currently paying employees</TooltipContent>
          </Tooltip>

          {/* Total Streamed */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Allocated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#FFD600]">{Number(totalStreaming).toFixed(2)}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Total CELO allocated in all streams</TooltipContent>
          </Tooltip>

          {/* Total Withdrawn */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] stat-card hover-lift cursor-help">
                <CardHeader>
                  <CardTitle className="text-xs text-[#cccccc] flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Paid Out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-400">{Number(totalWithdrawn).toFixed(2)}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Total CELO withdrawn by employees</TooltipContent>
          </Tooltip>
        </div>

        {/* Create Stream Card */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#0a0a0a] to-[#000000] hover-lift">
          <CardHeader className="bg-gradient-to-r from-[#FFD600]/10 to-transparent">
            <CardTitle className="flex items-center gap-2">
              ✨ Create New Stream
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-[#cccccc] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Set up a new salary stream for an employee</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="text-sm font-medium text-[#cccccc] block mb-2">Employee Wallet Address</label>
              <Input
                value={employeeAddress}
                onChange={(event) => setEmployeeAddress(event.target.value)}
                placeholder="0x1234567890abcdef..."
                className="bg-[#1a1a1a] border-[#1a1a1a] transition-all duration-300 focus:border-[#FFD600] focus:ring-[#FFD600]/20"
                disabled={interactionDisabled || isCreating}
              />
              <p className="text-xs text-[#999999] mt-1">The wallet that will receive the stream</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#cccccc] block mb-2">Total Salary (CELO)</label>
                <Input
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                  placeholder="1.5"
                  type="number"
                  min="0"
                  step="0.01"
                  className="bg-[#1a1a1a] border-[#1a1a1a] transition-all duration-300 focus:border-[#FFD600] focus:ring-[#FFD600]/20"
                  disabled={interactionDisabled || isCreating}
                />
                <p className="text-xs text-[#999999] mt-1">Total amount to stream</p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#cccccc] block mb-2">Duration (Seconds)</label>
                <Input
                  value={durationSeconds}
                  onChange={(event) => setDurationSeconds(event.target.value)}
                  placeholder="2592000"
                  type="number"
                  min="1"
                  className="bg-[#1a1a1a] border-[#1a1a1a] transition-all duration-300 focus:border-[#FFD600] focus:ring-[#FFD600]/20"
                  disabled={interactionDisabled || isCreating}
                />
                <p className="text-xs text-[#999999] mt-1">How long to stream (30 days = 2592000)</p>
              </div>
            </div>

            <Button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-[#FFD600] to-[#FFC700] hover:from-[#FFD600]/90 hover:to-[#FFC700]/90 text-black font-bold h-11 transition-all duration-300 transform hover:scale-105"
              disabled={interactionDisabled || isCreating}
            >
              {isCreating ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Creating...
                </>
              ) : (
                '🚀 Start Streaming'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Streams Table */}
        <Card className="border-[#1a1a1a] bg-[#0a0a0a] hover-lift">
          <CardHeader className="bg-gradient-to-r from-[#FFD600]/10 to-transparent flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📊 Active Streams
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-[#cccccc] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Manage your salary streams. Use search to filter. Export data anytime.</TooltipContent>
              </Tooltip>
            </CardTitle>
            {employerStreams.length > 0 && <ExportStreamsData streams={employerStreams} />}
          </CardHeader>
          <CardContent className="pt-6">
            {employerStreams.length > 0 && <StreamSearch streams={employerStreams} onFilter={setFilteredStreams} />}

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : employerStreams.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <TrendingUp className="w-12 h-12 mx-auto text-[#cccccc]/30" />
                <p className="text-sm text-[#cccccc]">No streams yet</p>
                <p className="text-xs text-[#999999]">Create your first stream above ⬆️</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>ID</TableHead>
                      <TableHead>Employee</TableHead>
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
                        <TableCell className="font-mono text-xs">{`${stream.employee.slice(0, 6)}...${stream.employee.slice(-4)}`}</TableCell>
                        <TableCell className="font-semibold">{Number(formatEther(stream.totalAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-xs">{(Number(stream.duration) / 86400).toFixed(1)}d</TableCell>
                        <TableCell>{Number(formatEther(stream.withdrawnAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-[#FFD600] font-semibold">{Number(formatEther(stream.available)).toFixed(4)}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2 py-1 rounded transition-all ${stream.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {stream.isActive ? '🟢 Active' : '⭕ Stopped'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 hover:bg-red-500/10 text-red-300 text-xs transition-all duration-300"
                            disabled={!stream.isActive || interactionDisabled || pendingCancelId === stream.id}
                            onClick={() => handleCancel(stream.id)}
                          >
                            {pendingCancelId === stream.id ? <Spinner className="w-3 h-3" /> : '✕ Cancel'}
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
