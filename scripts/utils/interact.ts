import { ethers } from "hardhat";
import BookUtils from "./../../artifacts/contracts/BookUtils.sol/BookUtils.json";

export default class Interact {

    private _wallet: any;
    private _contract: any;

    constructor(providerRPC: string, privateKey: string, contractAddress: string) {
        /** PROVIDER/NODE **/
        const provider = new ethers.providers.JsonRpcProvider(providerRPC);

        /** WALLET **/
        this._wallet = new ethers.Wallet(privateKey, provider);
        this._contract = new ethers.Contract(contractAddress, BookUtils.abi, this._wallet);
    }

    private getContract() : any {
        return this._contract;
    }

    private getWallet() : any {
        return this._wallet;
    }
    
    public async addNewBook(name: string, author: string, copies: number) : Promise<void>  {
        const addNewBook = await this.getContract().addNewBook(name, author, copies);
        const addNewBookTx = await addNewBook.wait();
        if (addNewBookTx.status != 1) {
            console.log("Transaction failed");
        }
        console.log("Book Added: " + name + ", " + author);
    }

    public async checkAvailableBooks() : Promise<void> {
        const checkAvailableBooks = await this.getContract().showAvailableBooks();
        console.log("Books availability: ", await checkAvailableBooks);
    };

    public async borrowABook(bookId: string) : Promise<void> {
        const borrowBook = await this.getContract().borrowABook(bookId);
        const borrowBookTx = await borrowBook.wait();
        if (borrowBookTx.status != 1) {
            console.log("Transaction failed");
        }
        console.log("Book rented: " + bookId);
    };
    
    public async checkIfBorrowedByBookId(bookId: string) : Promise<void> {
        const address = (await this.getWallet().getAddress()).toString();
        const isBookBorrowedBy = await this.getContract().borrowedBooks(address, bookId);
        console.log(isBookBorrowedBy  ? "YES, book is borrowed by " : "NO, book is NOT borrowed by", address);
    };
    
    public async returnABook(bookId: string) : Promise<void> {
        const returnABook = await this.getContract().returnBook(bookId);
        const returnABookTx = await returnABook.wait();
        if (returnABookTx.status != 1) {
            console.log("Transaction failed");
        }
        console.log("Book returned: " + bookId);
    };
    
    /**
     * @TODO think more how to handle when book is not in the list
     * p.s. if not exisiting always returns 0 index
     */
    public async checkAvailabilityOfBookById(bookId: string) : Promise<void>{
        const bookIndex = await this.getContract().availableIdToIndex(bookId);
        const book = await this.getContract().allBooks(bookIndex);
        console.log(book.name, book.author, "| Available copies: " + book.copies);
    };
    
    public getBookHashedId(name: string, author: string) : string  {
        const bookId = ethers.utils.keccak256(ethers.utils.concat([
            ethers.utils.toUtf8Bytes(name), 
            ethers.utils.toUtf8Bytes(author)
        ]));
        return bookId;
    }
}