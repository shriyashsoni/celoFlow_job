'use client';

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatEther } from 'viem';

interface ExportDataProps {
  streams: any[];
  filename?: string;
}

export function ExportStreamsData({ streams, filename = 'celoflow-streams.csv' }: ExportDataProps) {
  const [copied, setCopied] = useState(false);

  const exportToCSV = () => {
    if (!streams.length) {
      toast.error('No streams to export');
      return;
    }

    const headers = ['ID', 'Employee', 'Total Amount', 'Duration (Days)', 'Withdrawn', 'Available', 'Status'];
    const rows = streams.map((s) => [
      s.id?.toString() || '',
      s.employee || '',
      Number(formatEther(s.totalAmount || BigInt(0))).toFixed(4),
      (Number(s.duration || 0) / 86400).toFixed(1),
      Number(formatEther(s.withdrawnAmount || BigInt(0))).toFixed(4),
      Number(formatEther(s.available || BigInt(0))).toFixed(4),
      s.isActive ? 'Active' : 'Cancelled',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    toast.success('Streams exported successfully');
  };

  const copyToClipboard = async () => {
    const text = streams
      .map(
        (s) =>
          `Stream #${s.id} - ${s.employee} - ${Number(formatEther(s.totalAmount || BigInt(0))).toFixed(4)} CELO - ${s.isActive ? 'Active' : 'Cancelled'}`
      )
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCSV}
        size="sm"
        variant="outline"
        className="border-[#1a1a1a] hover:bg-[#0a0a0a] text-xs"
      >
        <Download className="w-3 h-3 mr-1" />
        Export CSV
      </Button>
      <Button
        onClick={copyToClipboard}
        size="sm"
        variant="outline"
        className="border-[#1a1a1a] hover:bg-[#0a0a0a] text-xs"
      >
        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}
