import { ethers } from "hardhat";
import BookUtils from "./../artifacts/contracts/BookUtils.sol/BookUtils.json";
import * as dotenv from "dotenv";

dotenv.config();

const interactGoerli = (async() => {
    
    /**
     * PROVIDER/NODE
     */
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    /**
     * WALLET
     */
    const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const balance = await wallet.getBalance();
    console.log("ETH Balance: " + ethers.utils.formatEther(balance))

    /**
     * CONTRACT
     */
    const contractAddress = "0x992B8328B6bC2736525883759C764822D05ed4Ea";
    const bookUtilsContract = new ethers.Contract(contractAddress, BookUtils.abi, wallet);
    
    // 1. Creates a book
    const addNewBook = await bookUtilsContract.addNewBook("The Godfather", "Mario Puzo", 5); //already added
    const addNewBookTx = await addNewBook.wait();
    if (addNewBookTx.status != 1) {
        console.log("Transaction failed");
        return;
    }

    // 2. Checks all available books
    const checkAvailableBooks = await bookUtilsContract.showAvailableBooks();
    console.log(checkAvailableBooks);
})

interactGoerli();