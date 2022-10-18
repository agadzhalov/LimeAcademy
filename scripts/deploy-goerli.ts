import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployBookLibraryContract = async(args: any, hre: HardhatRuntimeEnvironment) => {
  await hre.run("compile");
  const [deployer] = await ethers.getSigners();
  await hre.run("print", { message: "Depoying with address: " + deployer.address + "\n" + "Balance: " + (await deployer.getBalance()).toString()});
  const BookUtils = await ethers.getContractFactory("BookUtils");
  const bookUtils = await BookUtils.deploy();
  await bookUtils.deployed();
  await hre.run("print", { message: "BookUtils deployed to: " + bookUtils.address});
}

export default deployBookLibraryContract;