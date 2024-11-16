'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { celoAlfajores, baseSepolia, scrollSepolia, mantleSepoliaTestnet } from 'wagmi/chains';

import Layout from '../components/Layout';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { Z_DEFAULT_COMPRESSION } from 'zlib';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet],
    },
  ],
  {
    appName: 'Celo Composer',
    projectId: process.env.WC_PROJECT_ID ?? '044601f65212332475a09bc14ceb3c34',
  }
);

const config = createConfig({
  connectors,
  chains: [celoAlfajores, baseSepolia, scrollSepolia, mantleSepoliaTestnet],
  transports: {
    [celoAlfajores.id]: http(),
    [baseSepolia.id]: http(),
    [scrollSepolia.id]: http(),
    [mantleSepoliaTestnet.id]: http()
  },
});

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Layout>{children}</Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
