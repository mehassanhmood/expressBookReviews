const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Validate username and password
    if (!isValid(username) || !authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // If credentials are valid, generate JWT token
    const token = jwt.sign({ username }, 'your_secret_key');
  
    // Save user credentials for the session
    users.push({ username, token });
  
    // Return the token in the response
    return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.user; // Assuming user information is attached to the request object after authentication
  
    // Find the book in the database
    const bookIndex = books.findIndex(book => book.isbn === isbn);
  
    // If book not found, return 404 Not Found
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already posted a review for the same ISBN
    const existingReviewIndex = books[bookIndex].reviews.findIndex(review => review.username === username);
  
    if (existingReviewIndex !== -1) {
      // If user has already posted a review, modify the existing review
      books[bookIndex].reviews[existingReviewIndex].content = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // If user has not posted a review, add a new review
      books[bookIndex].reviews.push({ username, content: review });
      return res.status(200).json({ message: "Review added successfully" });
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.user; // Assuming user information is attached to the request object after authentication
  
    // Find the book in the database
    const bookIndex = books.findIndex(book => book.isbn === isbn);
  
    // If book not found, return 404 Not Found
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Filter reviews based on the session username and delete them
    books[bookIndex].reviews = books[bookIndex].reviews.filter(review => review.username !== username);
  
    return res.status(200).json({ message: "Reviews deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
