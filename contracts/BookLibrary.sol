// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract BookLibrary is Ownable {

    struct Book {
        string name;
        string author;
        uint32 id;
        uint32 copies;
    }

    Book[] public books;

    mapping(uint32 => uint32) public availableBooks;
    mapping(string => bool) public isBookAdded;
    mapping(address => mapping(uint32 => bool)) public borrowedBooks; 

    event BookAddedEvent(string name, string author, uint32 copies);

    modifier onlyUniqueBooks(string memory _name) {
        require (!isBookAdded[_name], "Book already added");
        _;
    }

    modifier onlyExistingBookIds(uint32 _bookId) {
        require (_bookId <= books.length, "Non existing book ID");
        _;
    }

    function addNewBook(string memory _name, string memory _author, uint32 _copies) public onlyOwner onlyUniqueBooks(_name) {
        require (_copies > 0, "New books' copies must be more than zero");
        uint32 _bookId = uint32(books.length);
        books.push(Book(_name, _author, _bookId, _copies));
        availableBooks[_bookId] = _copies;
        isBookAdded[_name] = true;
        emit BookAddedEvent(_name, _author, _copies);
    }

}