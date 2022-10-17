import { HardhatRuntimeEnvironment } from "hardhat/types";

const main = async (privateKey: string, hre: HardhatRuntimeEnvironment) => {
  const wallet = new ethers.Wallet(privateKey, hre.ethers.provider);
  //await hre.run("print", { message: "Address: " + wallet.address});
  //await hre.run("print", { message: "Balance: " + (await wallet.getBalance()).toString()});

  const BookUtils = await ethers.getContractFactory("BookUtils", wallet);
  const bookUtils = await BookUtils.deploy();
  await bookUtils.deployed();
  await hre.run("print", { message: "BookUtils deployed to: " + bookUtils.address });
};

export function executeDeploy(privateKey: string, hre: HardhatRuntimeEnvironment) {
  try {
    main(privateKey, hre);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });