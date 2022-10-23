import Interact from "./utils/interact";

const interactLocally = (async() => {
    const PROVIDER_RPC  = "http://127.0.0.1:8545";
    const LOCAL_PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY !== undefined ? process.env.LOCAL_PRIVATE_KEY : "";;
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const interact = new Interact(PROVIDER_RPC, LOCAL_PRIVATE_KEY, CONTRACT_ADDRESS);

    // 1. Creates book
    await interact.addNewBook("The Godfather", "Mario Puzo", 5).catch((error) => {});
    await interact.addNewBook("Hooked", "Nir Eyal", 1).catch((error) => {});

    // 2. Checks all available books
    await interact.checkAvailableBooks();

    // 3. Rents a book
    await interact.borrowABook(interact.getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});

    // 4. Checks if a book is borrowed by ID
    await interact.checkIfBorrowedByBookId(interact.getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});

    // 5. Returns a book
    await interact.returnABook(interact.getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});

    // 6. Checks availability of a book
    await interact.checkAvailabilityOfBookById(interact.getBookHashedId("Hooked", "Nir Eyal")).catch((error) => {});
});

interactLocally();