const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users object
  users[username] = { username, password };

  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
async function getBooks() {
    try {
        const response = await axios.get('http://api.example.com/books'); // Replace the URL with the actual endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error; // Rethrow the error to handle it outside
    }
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://api.example.com/books/isbn/${isbn}`); // Replace the URL with the actual endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error; // Rethrow the error to handle it outside
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await getBookByISBN(isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

  
// Get book details based on author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://api.example.com/books/author/${author}`); // Replace the URL with the actual endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error; // Rethrow the error to handle it outside
    }
}

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const books = await getBooksByAuthor(author);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all books based on title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://api.example.com/books/title/${title}`); // Replace the URL with the actual endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error; // Rethrow the error to handle it outside
    }
}

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const books = await getBooksByTitle(title);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  // Check if books is an object (dictionary)
  if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error" });
  }
  
  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Get the reviews for the book
  const reviews = books[isbn].reviews;
  
  res.status(200).json(reviews);
});

module.exports.general = public_users;
