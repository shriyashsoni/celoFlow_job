'use client';

import { useCallback, useMemo } from 'react';
import {
  useAccount,
  useBalance,
  useChainId,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { toast } from 'sonner';
import {
  CELO_ALFAJORES_CHAIN_ID,
  CELOFLOW_ABI,
  CELOFLOW_CONTRACT_ADDRESS,
  type CeloFlowStream,
} from '@/lib/contract';

const shortenAddress = (address?: string) => {
  if (!address) return '-';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function useCeloWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, query: { enabled: !!address } });
  const celoBalance = balance ? formatEther(balance.value) : '0';

  return {
    address,
    isConnected,
    chainId,
    isWrongNetwork: isConnected && chainId !== CELO_ALFAJORES_CHAIN_ID,
    shortAddress: shortenAddress(address),
    celoBalance,
  };
}

export function useCeloFlowData() {
  const { address } = useAccount();

  const { data: nextStreamId, refetch: refetchCount, isLoading: isCountLoading } = useReadContract({
    address: CELOFLOW_CONTRACT_ADDRESS,
    abi: CELOFLOW_ABI as any,
    functionName: 'nextStreamId',
  });

  const streamIds = useMemo(() => {
    const total = Number(nextStreamId ?? BigInt(0));
    if (!Number.isFinite(total) || total <= 0) return [] as bigint[];
    return Array.from({ length: total }, (_, index) => BigInt(index));
  }, [nextStreamId]);

  const {
    data: streamReads,
    refetch: refetchStreams,
    isLoading: isStreamsLoading,
  } = useReadContracts({
    contracts: streamIds.map((id) => ({
      address: CELOFLOW_CONTRACT_ADDRESS,
      abi: CELOFLOW_ABI as any,
      functionName: 'streams',
      args: [id],
    })),
    query: {
      enabled: streamIds.length > 0,
    },
  });

  const parsedStreams = useMemo(() => {
    if (!streamReads || streamReads.length === 0) return [] as CeloFlowStream[];

    return streamReads
      .map((result, index) => {
        if (result.status !== 'success' || !result.result) return null;
        const [employer, employee, totalAmount, startTime, duration, withdrawnAmount, isActive] =
          result.result as [
            `0x${string}`,
            `0x${string}`,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
          ];

        return {
          id: streamIds[index],
          employer,
          employee,
          totalAmount,
          startTime,
          duration,
          withdrawnAmount,
          isActive,
          available: BigInt(0),
        } as CeloFlowStream;
      })
      .filter(Boolean) as CeloFlowStream[];
  }, [streamIds, streamReads]);

  const {
    data: availableReads,
    refetch: refetchAvailable,
    isLoading: isAvailableLoading,
  } = useReadContracts({
    contracts: parsedStreams.map((stream) => ({
      address: CELOFLOW_CONTRACT_ADDRESS,
      abi: CELOFLOW_ABI as any,
      functionName: 'getAvailable',
      args: [stream.id],
    })),
    query: {
      enabled: parsedStreams.length > 0,
      refetchInterval: 1000,
    },
  });

  const streams = useMemo(() => {
    return parsedStreams.map((stream, index) => {
      const availableResult = availableReads?.[index];
      const available =
        availableResult?.status === 'success' ? (availableResult.result as bigint) : BigInt(0);
      return {
        ...stream,
        available,
      };
    });
  }, [availableReads, parsedStreams]);

  const employerStreams = useMemo(() => {
    if (!address) return [] as CeloFlowStream[];
    return streams.filter((stream) => stream.employer.toLowerCase() === address.toLowerCase());
  }, [address, streams]);

  const employeeStreams = useMemo(() => {
    if (!address) return [] as CeloFlowStream[];
    return streams.filter((stream) => stream.employee.toLowerCase() === address.toLowerCase());
  }, [address, streams]);

  const myStreams = useMemo(() => {
    if (!address) return [] as CeloFlowStream[];
    return streams.filter(
      (stream) =>
        stream.employee.toLowerCase() === address.toLowerCase() ||
        stream.employer.toLowerCase() === address.toLowerCase(),
    );
  }, [address, streams]);

  const totals = useMemo(() => {
    const totalStreamsCreated = employerStreams.length;
    const totalActiveStreams = myStreams.filter((stream) => stream.isActive).length;
    const totalAmountStreamed = myStreams.reduce((acc, stream) => acc + stream.totalAmount, BigInt(0));
    const totalWithdrawn = myStreams.reduce((acc, stream) => acc + stream.withdrawnAmount, BigInt(0));
    const totalEmployeeAvailable = employeeStreams.reduce(
      (acc, stream) => acc + stream.available,
      BigInt(0),
    );

    return {
      totalStreamsCreated,
      totalActiveStreams,
      totalAmountStreamed,
      totalWithdrawn,
      totalEmployeeAvailable,
    };
  }, [employeeStreams, employerStreams, myStreams]);

  const refetchAll = useCallback(async () => {
    await refetchCount();
    await refetchStreams();
    await refetchAvailable();
  }, [refetchAvailable, refetchCount, refetchStreams]);

  return {
    streams,
    employerStreams,
    employeeStreams,
    myStreams,
    totals,
    refetchAll,
    isLoading: isCountLoading || isStreamsLoading || isAvailableLoading,
    streamCount: Number(nextStreamId ?? BigInt(0)),
  };
}

export function useCeloFlowActions() {
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const waitForConfirmation = useCallback(
    async (hash: `0x${string}`) => {
      if (!publicClient) {
        throw new Error('No public client found for current network');
      }
      await publicClient.waitForTransactionReceipt({ hash });
    },
    [publicClient],
  );

  const createStream = useCallback(
    async ({ employee, durationSeconds, salaryEth }: { employee: string; durationSeconds: number; salaryEth: string }) => {
      if (!isAddress(employee)) {
        throw new Error('Invalid employee address');
      }
      if (!salaryEth || Number(salaryEth) <= 0) {
        throw new Error('Salary must be greater than zero');
      }
      if (!durationSeconds || durationSeconds <= 0) {
        throw new Error('Duration must be greater than zero');
      }

      const value = parseEther(salaryEth);
      const txHash = await writeContractAsync({
        address: CELOFLOW_CONTRACT_ADDRESS,
        abi: CELOFLOW_ABI as any,
        functionName: 'createStream',
        args: [employee as `0x${string}`, BigInt(durationSeconds)],
        value,
      });

      toast.info('Transaction submitted. Waiting for confirmation...');
      await waitForConfirmation(txHash);
      toast.success('Stream created successfully');
      return txHash;
    },
    [waitForConfirmation, writeContractAsync],
  );

  const cancelStream = useCallback(
    async (streamId: bigint) => {
      const txHash = await writeContractAsync({
        address: CELOFLOW_CONTRACT_ADDRESS,
        abi: CELOFLOW_ABI as any,
        functionName: 'cancelStream',
        args: [streamId],
      });

      toast.info('Cancel transaction submitted. Waiting for confirmation...');
      await waitForConfirmation(txHash);
      toast.success('Stream cancelled successfully');
      return txHash;
    },
    [waitForConfirmation, writeContractAsync],
  );

  const withdraw = useCallback(
    async (streamId: bigint) => {
      const txHash = await writeContractAsync({
        address: CELOFLOW_CONTRACT_ADDRESS,
        abi: CELOFLOW_ABI as any,
        functionName: 'withdraw',
        args: [streamId],
      });

      toast.info('Withdraw transaction submitted. Waiting for confirmation...');
      await waitForConfirmation(txHash);
      toast.success('Withdrawal successful');
      return txHash;
    },
    [waitForConfirmation, writeContractAsync],
  );

  return {
    createStream,
    cancelStream,
    withdraw,
    formatEther,
  };
}
