// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract BookLibrary is Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _bookIds;

    struct Book {
        string name;
        string author;
        bytes32 id;
        uint32 copies;
    }

    Book[] public books;

    mapping(string => bool) public isBookAdded;

    mapping(bytes32 => uint32) public availableCopiesMap; // id => copies
    mapping(bytes32 => bool) public isCopyInserted; // id -> bool
    mapping(bytes32 => uint) public availableIdToIndex; // id => index of array
    
    struct AvailableBooks {
        bytes32 id;
        string name;
        string author;
        uint32 copies;
    }
    
    AvailableBooks[] public allBooksAvailability;

    event BookAddedEvent(string name, string author, uint32 copies);

    modifier onlyUniqueBooks(string memory _name) {
        require (!isBookAdded[_name], "Book already added");
        _;
    }

    modifier onlyExistingBookIds(bytes32 _bookId) {
        require (isCopyInserted[_bookId], "Non existing book ID");
        _;
    }

    function addNewBook(string memory _name, string memory _author, uint32 _copies) public onlyOwner onlyUniqueBooks(_name) {
        require(bytes(_name).length != 0 && bytes(_author).length != 0, "Book title and author can not be empty");
        require (_copies > 0, "New books' copies must be more than zero");
        bytes32 newBookId = keccak256(abi.encodePacked(_name, _author));
        books.push(Book(_name, _author, newBookId, _copies));
        isBookAdded[_name] = true;
        setAvailableCopies(newBookId, _name, _author, _copies);
        emit BookAddedEvent(_name, _author, _copies);
    }

    function setAvailableCopies(bytes32 _bookId, string memory _name, string memory _author, uint32 _copies) internal {
        availableCopiesMap[_bookId] = _copies;
        isCopyInserted[_bookId] = true;
        allBooksAvailability.push(AvailableBooks(_bookId, _name, _author, _copies));
        availableIdToIndex[_bookId] = allBooksAvailability.length - 1;
    }

    function updateAvailableCopies(bytes32 _bookId, uint32 _copies) internal {
        availableCopiesMap[_bookId] = _copies;
        allBooksAvailability[availableIdToIndex[_bookId]].copies = availableCopiesMap[_bookId];
    }

}