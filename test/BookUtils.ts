import { expect } from "chai";
import { ethers } from "hardhat";
import { BookUtils } from "../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("BookUtils", function () {
    
    let bookUtilsFactory: any;
    let bookUtils: BookUtils;

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    let bookId: string;
    let bookIdTwo: string;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        bookUtilsFactory = await ethers.getContractFactory("BookUtils");
        bookUtils = await bookUtilsFactory.deploy();
        await bookUtils.deployed();

        bookId = ethers.utils.keccak256(ethers.utils.concat([
            ethers.utils.toUtf8Bytes("The Godfather"), 
            ethers.utils.toUtf8Bytes("Mario Puzo")
        ]));

        bookIdTwo = ethers.utils.keccak256(ethers.utils.concat([
            ethers.utils.toUtf8Bytes("Hooked"), 
            ethers.utils.toUtf8Bytes("Nir Eyal")
        ]));
    });
    
    it("Should list all available books names", async function () {
        const addNewBookTx = await bookUtils.addNewBook("The Godfather", "Mario Puzo", 5);
        await addNewBookTx.wait();

        const addNewBookTx2 = await bookUtils.addNewBook("Hooked", "Nir Eyal", 2);
        await addNewBookTx2.wait();

        expect(await bookUtils.showAvailableBooks()).to.deep.equal([
            [bookId, "The Godfather", "Mario Puzo", 5], 
            [bookIdTwo, "Hooked", "Nir Eyal", 2]
        ]);
    });

    it("Should list all available books after borrowed book", async function () {
        const addNewBookTx = await bookUtils.addNewBook("The Godfather", "Mario Puzo", 1);
        await addNewBookTx.wait();

        const addNewBookTx2 = await bookUtils.addNewBook("Hooked", "Nir Eyal", 2);
        await addNewBookTx2.wait();

        const borrowABookTx = await bookUtils.borrowABook(bookId);
        await borrowABookTx.wait();

        expect(await bookUtils.showAvailableBooks()).to.deep.equal([
            [bookId, "The Godfather", "Mario Puzo", 0], 
            [bookIdTwo, "Hooked", "Nir Eyal", 2]
        ]);
    });

    it("Should list all available books after a book was returned", async function () {
        const addNewBookTx = await bookUtils.addNewBook("The Godfather", "Mario Puzo", 1);
        await addNewBookTx.wait();

        const addNewBookTx2 = await bookUtils.addNewBook("Hooked", "Nir Eyal", 2);
        await addNewBookTx2.wait();

        const borrowABookTx = await bookUtils.borrowABook(bookId);
        await borrowABookTx.wait();

        const returnABookTx = await bookUtils.returnBook(bookId);
        await returnABookTx.wait();

        expect(await bookUtils.showAvailableBooks()).to.deep.equal([
            [bookId, "The Godfather", "Mario Puzo", 1], 
            [bookIdTwo, "Hooked", "Nir Eyal", 2]
        ]);
    });

    it("Should list all addresses that ever borrowed a book", async function () {
        const addNewBookTx = await bookUtils.addNewBook("The Godfather", "Mario Puzo", 5);
        await addNewBookTx.wait();

        const borrowABookTx = await bookUtils.connect(addr1).borrowABook(bookId);
        await borrowABookTx.wait();
        
        const borrowABookTx2 = await bookUtils.connect(owner).borrowABook(bookId);
        await borrowABookTx2.wait();

        expect(await bookUtils.historyOfBorrowAddresses(bookId)).to.deep.equal([
            '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
          ]
        );
    });
});
