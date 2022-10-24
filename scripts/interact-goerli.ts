import Interact from "./utils/interact";
import * as dotenv from "dotenv";

dotenv.config();

const interactGoerli = (async() => {
    const PROVIDER_RPC  = process.env.RPC_URL !== undefined ? process.env.RPC_URL : ""; 
    const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "";
    const CONTRACT_ADDRESS = "0xbAFa637b2d822974EAaE803f1236811AeC1090D5";

    const interact = new Interact(PROVIDER_RPC, PRIVATE_KEY, CONTRACT_ADDRESS);

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
})

interactGoerli();