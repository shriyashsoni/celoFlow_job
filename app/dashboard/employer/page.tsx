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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCeloFlowActions, useCeloFlowData, useCeloWallet } from '@/lib/useCeloFlow';
import { Info, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const toDateTime = (seconds: bigint) => {
  if (!seconds || seconds <= BigInt(0)) return '-';
  return new Date(Number(seconds) * 1000).toLocaleString();
};

export default function EmployerDashboardPage() {
  const { isConnected, isWrongNetwork } = useCeloWallet();
  const { employerStreams, refetchAll, isLoading } = useCeloFlowData();
  const { createStream, cancelStream } = useCeloFlowActions();

  const [employeeAddress, setEmployeeAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<bigint | null>(null);

  const interactionDisabled = !isConnected || isWrongNetwork;

  const totalActive = useMemo(() => employerStreams.filter((stream) => stream.isActive).length, [employerStreams]);

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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create stream';
      if (message.toLowerCase().includes('rejected')) {
        toast.error('Transaction rejected by user');
      } else if (message.toLowerCase().includes('insufficient')) {
        toast.error('Insufficient funds to create stream');
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

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#1a1a1a] bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Employer Section</h1>
            <p className="text-sm text-[#cccccc]">Create and manage salary streams</p>
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
              <p className="font-semibold">💡 Quick Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Streams pay employees per second - no waiting for payday</li>
                <li>Employees can withdraw available amount anytime</li>
                <li>You can cancel active streams anytime</li>
                <li>Amount is in CELO tokens on Alfajores testnet</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors cursor-help">
                <CardHeader>
                  <CardTitle className="text-sm text-[#cccccc] flex items-center gap-2">
                    Total Streams <Info className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#FFD600]">{employerStreams.length}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>All salary streams you've created (active + cancelled)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors cursor-help">
                <CardHeader>
                  <CardTitle className="text-sm text-[#cccccc] flex items-center gap-2">
                    Active Streams <CheckCircle2 className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-400">{totalActive}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Streams currently paying employees in real-time</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors cursor-help">
                <CardHeader>
                  <CardTitle className="text-sm text-[#cccccc] flex items-center gap-2">
                    Total Streamed <Clock className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    {Number(
                      formatEther(
                        employerStreams.reduce((sum, s) => sum + s.totalAmount, BigInt(0))
                      )
                    ).toFixed(2)}{' '}
                    CELO
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Total amount allocated across all streams</TooltipContent>
          </Tooltip>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Create New Stream
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-[#cccccc] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Start a new salary stream for an employee</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#cccccc] block mb-2">Employee Wallet Address</label>
              <Input
                value={employeeAddress}
                onChange={(event) => setEmployeeAddress(event.target.value)}
                placeholder="0x1234567890abcdef..."
                className="bg-[#1a1a1a] border-[#1a1a1a]"
                disabled={interactionDisabled || isCreating}
              />
              <p className="text-xs text-[#999999] mt-1">The wallet address of the employee who will receive the stream</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#cccccc] block mb-2">Total Salary Amount (CELO)</label>
              <Input
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
                placeholder="1.5"
                type="number"
                min="0"
                step="0.01"
                className="bg-[#1a1a1a] border-[#1a1a1a]"
                disabled={interactionDisabled || isCreating}
              />
              <p className="text-xs text-[#999999] mt-1">Total amount to stream over the duration period</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#cccccc] block mb-2">Duration (Seconds)</label>
              <Input
                value={durationSeconds}
                onChange={(event) => setDurationSeconds(event.target.value)}
                placeholder="2592000"
                type="number"
                min="1"
                className="bg-[#1a1a1a] border-[#1a1a1a]"
                disabled={interactionDisabled || isCreating}
              />
              <p className="text-xs text-[#999999] mt-1">How long the stream will run (e.g., 2592000 = 30 days)</p>
            </div>

            <Button
              onClick={handleCreate}
              className="w-full bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold h-10"
              disabled={interactionDisabled || isCreating}
            >
              {isCreating ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Creating Stream...
                </>
              ) : (
                '✨ Start Streaming'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Active Streams
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-[#cccccc] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Manage your salary streams here. Cancel anytime to stop payment.</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : employerStreams.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#cccccc]">No streams yet. Create your first one above! ⬆️</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">Total Amount</span>
                          </TooltipTrigger>
                          <TooltipContent>Total CELO to stream</TooltipContent>
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
                      <TableHead>Started</TableHead>
                      <TableHead>Withdrawn</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employerStreams.map((stream) => (
                      <TableRow key={stream.id.toString()} className="hover:bg-[#0a0a0a]/50">
                        <TableCell className="font-mono text-sm">{stream.id.toString()}</TableCell>
                        <TableCell className="font-mono text-xs">{`${stream.employee.slice(0, 6)}...${stream.employee.slice(-4)}`}</TableCell>
                        <TableCell className="font-semibold">{Number(formatEther(stream.totalAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-xs">{(Number(stream.duration) / 86400).toFixed(1)}d</TableCell>
                        <TableCell className="text-xs">{toDateTime(stream.startTime)}</TableCell>
                        <TableCell>{Number(formatEther(stream.withdrawnAmount)).toFixed(4)}</TableCell>
                        <TableCell className="text-[#FFD600] font-semibold">{Number(formatEther(stream.available)).toFixed(4)}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${stream.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {stream.isActive ? '🟢 Active' : '⭕ Cancelled'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 hover:bg-red-500/10 text-red-300 text-xs"
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
