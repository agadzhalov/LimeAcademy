import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployGoerli = async(args: any, hre: HardhatRuntimeEnvironment) => {
  await hre.run("compile");
  const [deployer] = await ethers.getSigners();
  await hre.run("print", { message: "Depoying with address: " + deployer.address + "\n" + "Balance: " + (await deployer.getBalance()).toString()});

  const BookUtils = await ethers.getContractFactory("BookUtils");
  const bookUtils = await BookUtils.deploy();
  await bookUtils.deployed();

  await hre.run("print", { message: "BooUtils deployed to: " + bookUtils.address});

  console.log("Wait 60 seconds for verification");
  await new Promise(f => setTimeout(f, 60000));

  await hre.run("verify:verify", {
    address: bookUtils.address,
    constructorArguments: [],
  });
}

export default deployGoerli;