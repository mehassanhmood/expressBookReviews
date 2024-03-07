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
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = Object.values(books).map(book => {
    return {
      title: book.title,
      author: book.author,
      ISBN: book.ISBN
    };
  });
  res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  // Check if books is an object (dictionary)
  if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error" });
  }
  
  // Find the book with the given ISBN
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  // Check if books is an object (dictionary)
  if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error" });
  }
  
  // Find books by the given author
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found by this author" });
  }

  res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  // Check if books is an object (dictionary)
  if (typeof books !== 'object' || books === null) {
    return res.status(500).json({ message: "Internal server error" });
  }
  
  // Find books by the given title
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  
  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  res.status(200).json(booksByTitle);
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
