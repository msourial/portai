import { useState, useEffect } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

declare global {
  interface Window {
    ethereum?: any;
  }
}

type WalletType = 'metamask' | 'coinbase';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccount(accounts[0]);
      setWalletType('metamask');
      setError(null);
    } catch (err) {
      setError("Failed to connect MetaMask");
      console.error(err);
    }
  };

  const connectCoinbase = async () => {
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "portfolAI",
        appLogoUrl: "", // Add your app logo URL here
        darkMode: false
      });

      const ethereum = coinbaseWallet.makeWeb3Provider();
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      setAccount(accounts[0]);
      setWalletType('coinbase');
      setError(null);
    } catch (err) {
      setError("Failed to connect Coinbase Wallet");
      console.error(err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return { 
    account, 
    connectMetaMask, 
    connectCoinbase, 
    error,
    walletType 
  };
}