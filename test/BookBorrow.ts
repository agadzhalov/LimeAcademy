import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookBorrow", function () {
    
    let bookBorrowFactory;
    let bookBorrow;

    let owner;
    let addr1;
    let addr2;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        bookBorrowFactory = await ethers.getContractFactory("BookBorrow");
        bookBorrow = await bookBorrowFactory.deploy();
        await bookBorrow.deployed();
    });

    // borrow a book
    it("Should borrow a book", async function () {
        const addNewBookTx = await bookBorrow.addNewBook("The Godfather", "Mario Puzo", 5);
        await addNewBookTx.wait();

        const borrowABookTx = await bookBorrow.borrowABook(0);
        await borrowABookTx.wait();
        
        expect(await bookBorrow.borrowedBooks(owner.address, 0)).to.equal(true);
    });

    // try borrow tha same book twice
    it("Should throw on trying to borrow the same book twice", async function () {
        const addNewBookTx = await bookBorrow.addNewBook("The Godfather", "Mario Puzo", 5);
        await addNewBookTx.wait();

        const borrowABookTx = await bookBorrow.borrowABook(0);
        await borrowABookTx.wait();

        await expect(bookBorrow.borrowABook(0)).to.be.revertedWith("You can borrow only one copy of this book");
    });
    
    // try borrow a book when not available
    it("Should throw on trying to borrow a book which is not available", async function () {
        const addNewBookTx = await bookBorrow.addNewBook("The Godfather", "Mario Puzo", 2);
        await addNewBookTx.wait();

        const borrowABookTx = await bookBorrow.connect(addr1).borrowABook(0);
        await borrowABookTx.wait();
        
        const borrowABookSecondTimeTx = await bookBorrow.connect(addr2).borrowABook(0);
        await borrowABookSecondTimeTx.wait();
        
        await expect(bookBorrow.connect(owner).borrowABook(0)).to.be.revertedWith("Book copy is not available.");
    });

    // try borrow a book when not available
    it("Should throw on trying to borrow a book not inserted", async function () {
        await expect(bookBorrow.borrowABook(0)).to.be.revertedWith("Book copy is not available."); // think more on this case
        await expect(bookBorrow.borrowABook(1)).to.be.revertedWith("Non existing book ID");
        await expect(bookBorrow.borrowABook(4253)).to.be.revertedWith("Non existing book ID");
    });

    // return a book you've borrowed
    // try returning a book you haven't borrowed
    // should be able to borrow a book when returned from others
});
