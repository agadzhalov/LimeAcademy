import { HardhatUserConfig, subtask, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { executeDeploy } from './scripts/deploy-goerli';

import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  networks: {
    goerli: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY || ""
  }
};

export default config;

task("deploy-goerli", "Deploys contract on Goerli network")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async({privateKey}, hre: HardhatRuntimeEnvironment) => {
    await executeDeploy(privateKey, hre);
  });

subtask("print", "Prints valuable info")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
});