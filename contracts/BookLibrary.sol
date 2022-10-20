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

    struct AvailableBookDetails {
        uint id;
        string name;
    }

    AvailableBookDetails[] public availableBookDetails;

    mapping(uint32 => uint32) public availableBooks;
    mapping(string => uint32) public availableNameToId;
    mapping(string => bool) public isBookAdded;

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
        availableBooks[newBookId] = _copies;
        insertAvailableBook(newBookId, _name);
        emit BookAddedEvent(_name, _author, _copies);
    }

    function insertAvailableBook(uint32 _bookId, string memory _name) internal {
        availableBookDetails.push(AvailableBookDetails(_bookId, _name));
        availableNameToId[_name] = _bookId;
    }

    function _generateNewBookId() private returns(uint32){
        _bookIds.increment();
        return uint32(_bookIds.current());
    }

}