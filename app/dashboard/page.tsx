'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatEther } from 'viem';
import { useCeloFlowData, useCeloWallet } from '@/lib/useCeloFlow';

export default function DashboardPage() {
  const { isConnected, isWrongNetwork, shortAddress, celoBalance } = useCeloWallet();
  const { totals, employeeStreams } = useCeloFlowData();

  const isInteractionDisabled = !isConnected || isWrongNetwork;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#1a1a1a] bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-[#cccccc]">CeloFlow on Celo Alfajores</p>
          </div>
          <ConnectButton />
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-sm text-[#cccccc]">Wallet Address</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-mono">{isConnected ? shortAddress : '-'}</CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-sm text-[#cccccc]">Wallet Balance (CELO)</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{isConnected ? Number(celoBalance).toFixed(4) : '0.0000'}</CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-sm text-[#cccccc]">Total Streams Created</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-[#FFD600]">{totals.totalStreamsCreated}</CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-sm text-[#cccccc]">Total Active Streams</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{totals.totalActiveStreams}</CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-sm text-[#cccccc]">Total Amount Streamed (CELO)</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{Number(formatEther(totals.totalAmountStreamed)).toFixed(4)}</CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-sm text-[#cccccc]">Total Withdrawn (CELO)</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{Number(formatEther(totals.totalWithdrawn)).toFixed(4)}</CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle>Live Earnings Counter (Employee)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-[#FFD600]">
            {employeeStreams.length > 0 ? `${Number(formatEther(totals.totalEmployeeAvailable)).toFixed(6)} CELO` : 'No employee streams'}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/employer">
            <Button
              className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold"
              disabled={isInteractionDisabled}
            >
              Employer Section
            </Button>
          </Link>
          <Link href="/dashboard/employee">
            <Button variant="outline" className="border-[#1a1a1a]" disabled={isInteractionDisabled}>
              Employee Section
            </Button>
          </Link>
        </div>

        {!isConnected && <p className="text-sm text-[#cccccc]">Connect wallet to enable interactions.</p>}
      </main>
    </div>
  );
}
