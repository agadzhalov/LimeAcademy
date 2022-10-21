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
        uint32 id;
        uint32 copies;
    }

    Book[] public books;

    mapping(string => bool) public isBookAdded;

    mapping(uint32 => uint32) public availableCopiesMap; // id => copies
    mapping(uint32 => bool) public isCopyInserted; // id -> bool
    mapping(uint32 => uint) public availableIdToIndex; // id => index of array
    
    struct AvailableBooks {
        uint32 id;
        string name;
        uint32 copies;
    }
    
    AvailableBooks[] public allBooksAvailability;

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
        require(bytes(_name).length != 0 && bytes(_author).length != 0, "Book title and author can not be empty");
        require (_copies > 0, "New books' copies must be more than zero");
        uint32 newBookId = _generateNewBookId();
        books.push(Book(_name, _author, newBookId, _copies));
        isBookAdded[_name] = true;
        setAvailableCopies(newBookId, _name, _copies);
        emit BookAddedEvent(_name, _author, _copies);
    }

    function _generateNewBookId() private returns(uint32){
        _bookIds.increment();
        return uint32(_bookIds.current());
    }

    function setAvailableCopies(uint32 _bookId, string memory _name, uint32 _copies) internal {
        availableCopiesMap[_bookId] = _copies;
        isCopyInserted[_bookId] = true;
        allBooksAvailability.push(AvailableBooks(_bookId, _name, _copies));
        availableIdToIndex[_bookId] = allBooksAvailability.length - 1;
    }

    function updateAvailableCopies(uint32 _bookId, uint32 _copies) internal {
        availableCopiesMap[_bookId] = _copies;
        allBooksAvailability[availableIdToIndex[_bookId]].copies = availableCopiesMap[_bookId];
    }

}