import { ethers } from "hardhat";

async function main() {
  const BookUtils = await ethers.getContractFactory("BookUtils");
  const bookUtils = await BookUtils.deploy();
  await bookUtils.deployed();
  console.log("BookUtils deployed to:", bookUtils.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
