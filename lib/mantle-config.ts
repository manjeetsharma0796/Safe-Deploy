import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  mantleSepoliaTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Mantle Deploy Guard',
  projectId: '3a8170812b534d0ff9d794f19a5cafaa', // Public generic ID for testing
  chains: [mantleSepoliaTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
