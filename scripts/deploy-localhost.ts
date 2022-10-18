const deployLocally = async() => {
  const BookUtils = await ethers.getContractFactory("BookUtils");
  const bookUtils = await BookUtils.deploy();
  await bookUtils.deployed();
  console.log("BookUtils deployed to:", bookUtils.address);
}

export default deployLocally;