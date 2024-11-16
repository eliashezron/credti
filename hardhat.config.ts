import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";


dotenv.config();

const accounts = [
	process.env.PRIVATE_KEY
].filter((key): key is string => !!key);

const config: HardhatUserConfig = {
  networks: {		
		"ethereum-testnet": {
			chainId: 11155111,
			url: "https://eth-sepolia.public.blastapi.io",
			accounts: accounts,
		},
		"unichain-testnet": {
			chainId: 1301,
			url: "https://sepolia.unichain.org",
			accounts: accounts,
		},
		"scroll-testnet": {
			chainId: 534351,
			url: "https://scroll-sepolia.chainstacklabs.com",
			accounts: accounts,
		},
		alfajores: {
			url: "https://alfajores-forno.celo-testnet.org",
			accounts: accounts,
			chainId: 44787,
		  },
	},
	etherscan: {
		apiKey: {
		  // Is not required by blockscout. Can be any non-empty string
		  'alfajores': "abc"
		},
		customChains: [
		  {
			network: "alfajores",
			chainId: 11155420,
			urls: {
			  apiURL: "https://optimism-sepolia.blockscout.com/api",
			  browserURL: "https://optimism-sepolia.blockscout.com/",
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
