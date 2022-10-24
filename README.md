# Book Library - LimeAcademy

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

To deploy locally you will need two powershells:

Shell 1:
```shell
npx hardhat node
```
Shell 2:

```shell
npx hardhat deploy-localhost --network localhost
```

Deploy on Goerli:

```shell
npx hardhat run deploy-goerli --network goerli
```

Result is properly deployed and verified on Goerli testnet

Example TX on Goerli: 0x992B8328B6bC2736525883759C764822D05ed4Ea