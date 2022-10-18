import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployGoerli = async(args: any, hre: HardhatRuntimeEnvironment) => {
  await hre.run("compile");
  const [deployer] = await ethers.getSigners();
  await hre.run("print", { message: "Depoying with address: " + deployer.address + "\n" + "Balance: " + (await deployer.getBalance()).toString()});

  const BookLibrary = await ethers.getContractFactory("BookLibrary");
  const bookLibrary = await BookLibrary.deploy();
  await bookLibrary.deployed();

  await hre.run("print", { message: "BookLibrary deployed to: " + bookLibrary.address});

  console.log("Wait 60 seconds for verification");
  await new Promise(f => setTimeout(f, 60000));

  await hre.run("verify:verify", {
    address: bookLibrary.address,
    constructorArguments: [],
  });
}

export default deployGoerli;