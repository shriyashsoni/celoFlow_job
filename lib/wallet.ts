import { BrowserProvider } from 'ethers';

export interface WalletConnection {
  address: string;
  provider: BrowserProvider;
  connected: boolean;
}

export const connectWallet = async (): Promise<WalletConnection | null> => {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask or a Web3 wallet');
      return null;
    }

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts && accounts.length > 0) {
      return {
        address: accounts[0],
        provider,
        connected: true,
      };
    }
    return null;
  } catch (error) {
    console.error('Wallet connection error:', error);
    return null;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  try {
    if (window.ethereum && window.ethereum.isConnected) {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    }
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
};

export const checkWalletConnection = async (): Promise<WalletConnection | null> => {
  try {
    if (!window.ethereum) return null;

    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();

    if (accounts && accounts.length > 0) {
      return {
        address: accounts[0].address,
        provider,
        connected: true,
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking wallet:', error);
    return null;
  }
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
