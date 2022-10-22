import { ethers } from "hardhat";
import BookUtils from "./../artifacts/contracts/BookUtils.sol/BookUtils.json";

const interactLocally = (async() => {
    
    /**
     * PROVIDER/NODE
     */
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")

    /**
     * WALLET
     */
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const balance = await wallet.getBalance();
    console.log(balance.toString())
    console.log(ethers.utils.formatEther(balance))

    /**
     * CONTRACT
     */
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const bookUtilsContract = new ethers.Contract(contractAddress, BookUtils.abi, wallet);

    // 1. Creates book
    const addNewBook = await bookUtilsContract.addNewBook("The Godfather", "Mario Puzo", 5);
    const addNewBookTx = await addNewBook.wait();
    if (addNewBookTx.status != 1) {
        console.log("Transaction failed");
        return;
    }

    // 2. Checks all available books
    const checkAvailableBooks = await bookUtilsContract.showAvailableBooks();
    console.log(await checkAvailableBooks);
})

interactLocally();