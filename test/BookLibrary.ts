import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookLibrary", function () {

    let bookLibraryFactory;
    let bookLibrary;

    beforeEach(async () => {
        bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
        bookLibrary = await bookLibraryFactory.deploy();
        await bookLibrary.deployed();
    });

    it("Should add new book", async function () {
        const addNewBookTx = await bookLibrary.addNewBook("The Godfather", "Mario Puzo", 5);
        await addNewBookTx.wait();

        const book = await bookLibrary.books(0);
        expect(book.name).to.equal("The Godfather");
        expect(book.author).to.equal("Mario Puzo");
        expect(book.copies).to.equal(5);
    });

    it("Should throw on trying to add new book and not be the owner", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await expect(bookLibrary.connect(addr1).addNewBook("The Godfather", "Mario Puzo", 5)).to.be.revertedWith('Ownable: caller is not the owner');  
    });

    it("Should throw if book already added", async function () {
        const addFirstBookTx = await bookLibrary.addNewBook("The Godfather", "Mario Puzo", 5);
        await addFirstBookTx.wait();
        await expect(bookLibrary.addNewBook("The Godfather", "Mario Puzo", 15)).to.be.revertedWith('Book already added'); 
    });

    it("Should throw when trying to add empty book or author", async function () {
        await expect(bookLibrary.addNewBook("", "Mario Puzo", 8)).to.be.revertedWith("Book title and author can not be empty");
        await expect(bookLibrary.addNewBook("The Godfather", "", 8)).to.be.revertedWith("Book title and author can not be empty");
        await expect(bookLibrary.addNewBook("", "", 8)).to.be.revertedWith("Book title and author can not be empty");
    });

    it("Should throw when trying to add book with zero copies", async function () {
        await expect(bookLibrary.addNewBook("The Godfather", "Mario Puzo", 0)).to.be.revertedWith("New books' copies must be more than zero");
    });

    it("Shoud sent event that a book was added", async function () {
        const addNewBookTx = await bookLibrary.addNewBook("The Godfather", "Mario Puzo", 5);
        await addNewBookTx.wait();

        const book = await bookLibrary.books(0);
        await expect(addNewBookTx).to.emit(bookLibrary, 'BookAddedEvent').withArgs(book.name, book.author, book.copies);
    });

});
