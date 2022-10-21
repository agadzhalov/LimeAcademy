// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "./BookLibrary.sol";
import "hardhat/console.sol";

contract BookBorrow is BookLibrary {

    mapping(address => mapping(bytes32 => bool)) public borrowedBooks; 
    
    struct HistoryAddressSet {
        address[] addresses;
        mapping (address => bool) isIn;
    }

    mapping(bytes32 => HistoryAddressSet) historyAddresses;

    event BookBorrowedEvent(string name, string author);
    event BookReturnEvent(string name, string author);
    
    function borrowABook(bytes32 _bookId) external onlyExistingBookIds(_bookId) {
        require (availableCopiesMap[_bookId] > 0, "Book copy is not available.");
        require (borrowedBooks[msg.sender][_bookId] == false, "You can borrow only one copy of this book");
        borrowedBooks[msg.sender][_bookId] = true;
        updateAvailableCopies(_bookId, availableCopiesMap[_bookId] - 1);
        addAddressBorrowedABook(_bookId, msg.sender);
        emit BookBorrowedEvent(allBooks[availableIdToIndex[_bookId]].name, allBooks[availableIdToIndex[_bookId]].author);
    }

    function returnBook(bytes32 _bookId) external onlyExistingBookIds(_bookId) {
        require (borrowedBooks[msg.sender][_bookId] == true, "You didn't borrow this book");
        borrowedBooks[msg.sender][_bookId] = false;
        updateAvailableCopies(_bookId, availableCopiesMap[_bookId] + 1);
        emit BookReturnEvent(allBooks[availableIdToIndex[_bookId]].name, allBooks[availableIdToIndex[_bookId]].author);
    }

    /**
     * @notice restricts address repetitiveness for borrowed book.
     * In case an address borrowed the same book multiple times.
     */
    function addAddressBorrowedABook(bytes32 _bookId, address _address) private {
        if (!historyAddresses[_bookId].isIn[_address]) {
            historyAddresses[_bookId].addresses.push(_address);
            historyAddresses[_bookId].isIn[_address] = true;
        }
    }

}