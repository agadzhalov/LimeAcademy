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
    const LOCAL_PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY !== undefined ? process.env.LOCAL_PRIVATE_KEY : "";;
    const wallet = new ethers.Wallet(LOCAL_PRIVATE_KEY, provider);
    const balance = await wallet.getBalance();
    console.log(balance.toString())
    console.log(ethers.utils.formatEther(balance))

    /**
     * CONTRACT
     */
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const bookUtilsContract = new ethers.Contract(contractAddress, BookUtils.abi, wallet);

    // 1. Creates book
    await addNewBook(bookUtilsContract, "The Godfather", "Mario Puzo", 5).catch((error) => {});
    await addNewBook(bookUtilsContract, "Hooked", "Nir Eyal", 1).catch((error) => {});

    // 2. Checks all available books
    await checkAvailableBooks(bookUtilsContract);

    // 3. Rents a book
    await borrowABook(bookUtilsContract, getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});

    // 4. Checks if a book is borrowed by ID
    const address = (await wallet.getAddress()).toString();
    await checkIfBorrowedByBookId(bookUtilsContract, address, getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});

    // 5. Returns a book
    await returnABook(bookUtilsContract, getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});

    // 6. Checks availability of a book
    await checkAvailabilityOfBookById(bookUtilsContract, getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});
});

interactLocally();

const addNewBook = (async(contract: any, name: string, author: string, copies: number) : Promise<void> => {
    const addNewBook = await contract.addNewBook(name, author, copies);
    const addNewBookTx = await addNewBook.wait();
    if (addNewBookTx.status != 1) {
        console.log("Transaction failed");
    }
    console.log("Book Added: " + name + ", " + author);
});

const checkAvailableBooks = (async(contract: any) : Promise<void> => {
    const checkAvailableBooks = await contract.showAvailableBooks();
    console.log("Books availability: ", await checkAvailableBooks);
});

const borrowABook = (async(contract: any, bookId: string) : Promise<void> => {
    const borrowBook = await contract.borrowABook(bookId);
    const borrowBookTx = await borrowBook.wait();
    if (borrowBookTx.status != 1) {
        console.log("Transaction failed");
    }
    console.log("Book rented: " + bookId);
});

const checkIfBorrowedByBookId = (async(contract: any, address: string, bookId: string) : Promise<void> => {
    const isBookBorrowedBy = await contract.borrowedBooks(address, bookId);
    console.log(isBookBorrowedBy  ? "YES, book is borrowed by " : "NO, book is NOT borrowed by", address);
});

const returnABook = (async(contract: any, bookId: string) : Promise<void> => {
    const returnABook = await contract.returnBook(bookId);
    const returnABookTx = await returnABook.wait();
    if (returnABookTx.status != 1) {
        console.log("Transaction failed");
    }
    console.log("Book returned: " + bookId);
});


/**
 * @TODO think more how to handle when book is not in the list
 * p.s. if not exisiting always returns 0 index
 */
 const checkAvailabilityOfBookById = (async(contract: any, bookId: string) : Promise<void> => {
    const bookIndex = await contract.availableIdToIndex(bookId);
    const book = await contract.allBooks(bookIndex);
    console.log(book.name, book.author, "| Available copies: " + book.copies, );
});

const getBookHashedId =  (name: string, author: string) : string => {
    const bookId = ethers.utils.keccak256(ethers.utils.concat([
        ethers.utils.toUtf8Bytes(name), 
        ethers.utils.toUtf8Bytes(author)
    ]));
    return bookId;
}