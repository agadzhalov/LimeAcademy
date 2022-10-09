// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./BookBorrow.sol";

contract BookUtils is BookBorrow {

    function showAvailableBooks() external view returns(Book[] memory) {
        Book[] memory booksNowAvailable = new Book[](books.length);
        uint32 counter = 0;
        for (uint32 i = 0; i < books.length; i++) {
            if (availableBooks[i] > 0) {
                booksNowAvailable[counter] = books[i];
                counter++;
            }
        }
        return booksNowAvailable;
    }

    function historyOfBorrowAddresses(uint32 _bookId) external view returns(address[] memory) {
        return historyAddresses[_bookId].addresses;
    }

}