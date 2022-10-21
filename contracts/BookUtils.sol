// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "./BookBorrow.sol";

contract BookUtils is BookBorrow {

    function showAvailableBooks() external view returns(Book[] memory) {
        return allBooks;
    }

    function historyOfBorrowAddresses(bytes32 _bookId) external view returns(address[] memory) {
        return historyAddresses[_bookId].addresses;
    }

}