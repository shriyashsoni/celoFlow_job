'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle>Live Earnings (refreshes every 1 second)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-[#FFD600]">
            {Number(formatEther(totalAvailable)).toFixed(6)} CELO
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle>My Streams Table</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : employeeStreams.length === 0 ? (
              <p className="text-sm text-[#cccccc]">No streams found for this wallet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stream ID</TableHead>
                    <TableHead>Employer Address</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Withdrawn</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeStreams.map((stream) => (
                    <TableRow key={stream.id.toString()}>
                      <TableCell>{stream.id.toString()}</TableCell>
                      <TableCell className="font-mono">{`${stream.employer.slice(0, 6)}...${stream.employer.slice(-4)}`}</TableCell>
                      <TableCell>{Number(formatEther(stream.totalAmount)).toFixed(4)} CELO</TableCell>
                      <TableCell>{stream.duration.toString()}s</TableCell>
                      <TableCell>{Number(formatEther(stream.withdrawnAmount)).toFixed(4)} CELO</TableCell>
                      <TableCell>{Number(formatEther(stream.available)).toFixed(6)} CELO</TableCell>
                      <TableCell>{stream.isActive ? 'Active' : 'Cancelled'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black"
                          disabled={
                            interactionDisabled ||
                            !stream.isActive ||
                            stream.available <= BigInt(0) ||
                            pendingWithdrawId === stream.id
                          }
                          onClick={() => handleWithdraw(stream.id, stream.available)}
                        >
                          {pendingWithdrawId === stream.id ? <Spinner className="w-4 h-4" /> : 'Withdraw'}
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
