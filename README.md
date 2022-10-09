# Week 0 LimeAcademy - Book Library - main task

Functionalities implemented:

1. BookLibrary.sol
    1. Adding new books
    2. Modifier to check if the same book is already added
        1. Book is considered the same if both name and author are different 
    3. Modifier to validate if bookId is valid
2. BookBorrow.sol
    1. Borrow a book
    2. Return a book
    3. Add a unique address which borrowed a concrete book in a Set data structure
3. BookUtils.sol
    1. Shows current available copies of a concrete book
    2. Shows history of addresses ever borrowed a concrete book

To run:

```shell
npx hardhat run scripts/deploy.js
```

Result is not properly deploying and verifing the smart contracts

Example TX on Goerli: 0xe3788874a76F376248399E79513ce8c0fcb20ECC