// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./Ownable.sol";
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
    mapping(address => mapping(uint32 => bool)) public borrowedBooks; 

    event BookAddedEvent(string name, string author, uint32 copies);

    /**
    *   @notice restricts adding the same book multiple times
    *
    *   TO IMPROVE: Highly ineffective to iterate every time through all the books
    */
    modifier onlyUniqueBooks(string memory _name, string memory _author) {
        bool isAdded = false;
        for (uint32 i = 0; i < books.length; i++) {
            // books can have the same name but differrent authors
            if (keccak256(abi.encodePacked(books[i].name)) == keccak256(abi.encodePacked(_name)) &&
                keccak256(abi.encodePacked(books[i].author)) == keccak256(abi.encodePacked(_author)))
                isAdded = true;
        }
        require (!isAdded, "Book already added");
        _;
    }

    modifier onlyExistingBookIds(uint32 _bookId) {
        require (_bookId <= books.length, "Non existing book ID");
        _;
    }

    function addNewBook(string memory _name, string memory _author, uint32 _copies) public onlyOwner onlyUniqueBooks(_name, _author) {
        require (_copies > 0, "New books' copies must be more than zero");
        uint32 _bookId = uint32(books.length);
        books.push(Book(_name, _author, _bookId, _copies));
        availableBooks[_bookId] = _copies;
        emit BookAddedEvent(_name, _author, _copies);
    }

}