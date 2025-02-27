import { useState, useEffect } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import detectEthereumProvider from '@metamask/detect-provider';

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
    try {
      const provider = await detectEthereumProvider();

      if (!provider) {
        setError("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletType('metamask');
        setError(null);
      } else {
        throw new Error("No accounts found");
      }
    } catch (err: any) {
      console.error("MetaMask connection error:", err);
      setError(err.message || "Failed to connect MetaMask");
    }
  };

  const connectCoinbase = async () => {
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "portfolAI",
        appLogoUrl: "", // Add your app logo URL here
        darkMode: false
      });

      const ethereum = coinbaseWallet.makeWeb3Provider("https://mainnet.infura.io/v3/your-infura-id", 1); // Replace 'your-infura-id' with your Infura project ID

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletType('coinbase');
        setError(null);
      } else {
        throw new Error("No accounts found");
      }
    } catch (err: any) {
      console.error("Coinbase Wallet connection error:", err);
      setError(err.message || "Failed to connect Coinbase Wallet");
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