import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { vars } from "hardhat/config";
import dotenv from "dotenv";


dotenv.config();

const accounts = [
	process.env.PRIVATE_KEY
].filter((key): key is string => !!key);
 const celoScan: any = process.env.CELOSCAN_API_KEY;
 const baseScan: any = process.env.BASESCAN_API_KEY;
 const scrollScan: any = process.env.SCROLLSCAN_API_KEY;
 const arbitrumScan: any = process.env.ARBITRUMSCAN_API_KEY;

const config: HardhatUserConfig = {
  networks: {		
		baseSepolia: {
			chainId: 84532,
			url: "https://sepolia.base.org",
			accounts: accounts,
		},
		arbitrumOne: {
			chainId: 421614,
			url: "https://sepolia-rollup.arbitrum.io/rpc",
			accounts: accounts,
		},
		scrollSepolia: {
			chainId: 534351,
			url: "https://sepolia-rpc.scroll.io",
			accounts: accounts,
		},
		alfajores: {
			url: "https://alfajores-forno.celo-testnet.org",
			accounts: accounts,
			chainId: 44787,
		},
		// TODO
		// Morph
		// Zircuit
		// Linea
		// Mantle
	},
	etherscan: {
		apiKey: {
		  // Is not required by blockscout. Can be any non-empty string
		  alfajores: celoScan,
		   baseSepolia: baseScan,
		   scrollSepolia: scrollScan,
		   arbitrumOne: arbitrumScan,
		},
		customChains: [
		  {
			network: "alfajores",
			chainId: 44787,
			urls: {
				apiURL: 'https://api-alfajores.celoscan.io/api',
				browserURL: 'https://alfajores.celoscan.io',
			}
		  },
		  {
			network: "scrollSepolia",
			chainId: 534351,
			urls: {
			  apiURL: "https://api-sepolia.scrollscan.com/api",
			  browserURL: "https://sepolia.scrollscan.com",
			}
		  }
		]
	  },
	  sourcify: {
		enabled: false
	  },
  solidity: {
    compilers: [
      {
        version: "0.8.20", 
      },
      {
        version: "0.8.4",
      },
    ]},
};

export default config;
