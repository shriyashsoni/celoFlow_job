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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCeloFlowActions, useCeloFlowData, useCeloWallet } from '@/lib/useCeloFlow';

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
            <Link href="/dashboard">
              <Button variant="outline" className="border-[#1a1a1a]">Back</Button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {isWrongNetwork && (
          <Card className="border border-red-500/40 bg-red-500/10">
            <CardContent className="pt-6 text-sm text-red-300">
              Wrong network detected. Please switch to Celo Alfajores (Chain ID 44787).
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle>Create Stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={employeeAddress}
                onChange={(event) => setEmployeeAddress(event.target.value)}
                placeholder="Employee Address (0x...)"
                className="bg-[#1a1a1a] border-[#1a1a1a]"
                disabled={interactionDisabled || isCreating}
              />
              <Input
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
                placeholder="Total Salary (CELO)"
                type="number"
                min="0"
                className="bg-[#1a1a1a] border-[#1a1a1a]"
                disabled={interactionDisabled || isCreating}
              />
              <Input
                value={durationSeconds}
                onChange={(event) => setDurationSeconds(event.target.value)}
                placeholder="Duration in seconds"
                type="number"
                min="1"
                className="bg-[#1a1a1a] border-[#1a1a1a]"
                disabled={interactionDisabled || isCreating}
              />
              <Button
                onClick={handleCreate}
                className="w-full bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold"
                disabled={interactionDisabled || isCreating}
              >
                {isCreating ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Starting Stream...
                  </>
                ) : (
                  'Start Stream'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-[#cccccc]">Total Streams Created</p>
              <p className="text-3xl font-bold text-[#FFD600]">{employerStreams.length}</p>
              <p className="text-sm text-[#cccccc] mt-4">Total Active Streams</p>
              <p className="text-2xl font-semibold">{totalActive}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle>Active Streams Table</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : employerStreams.length === 0 ? (
              <p className="text-sm text-[#cccccc]">No streams found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stream ID</TableHead>
                    <TableHead>Employee Address</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Withdrawn Amount</TableHead>
                    <TableHead>Available Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employerStreams.map((stream) => (
                    <TableRow key={stream.id.toString()}>
                      <TableCell>{stream.id.toString()}</TableCell>
                      <TableCell className="font-mono">{`${stream.employee.slice(0, 6)}...${stream.employee.slice(-4)}`}</TableCell>
                      <TableCell>{Number(formatEther(stream.totalAmount)).toFixed(4)} CELO</TableCell>
                      <TableCell>{stream.duration.toString()}s</TableCell>
                      <TableCell>{toDateTime(stream.startTime)}</TableCell>
                      <TableCell>{Number(formatEther(stream.withdrawnAmount)).toFixed(4)} CELO</TableCell>
                      <TableCell>{Number(formatEther(stream.available)).toFixed(4)} CELO</TableCell>
                      <TableCell>{stream.isActive ? 'Active' : 'Cancelled'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#1a1a1a]"
                          disabled={!stream.isActive || interactionDisabled || pendingCancelId === stream.id}
                          onClick={() => handleCancel(stream.id)}
                        >
                          {pendingCancelId === stream.id ? <Spinner className="w-4 h-4" /> : 'Cancel'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
