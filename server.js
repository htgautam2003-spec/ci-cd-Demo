const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// Body parser
app.use(express.json());

// MongoDB connection
// Note: Make sure MONGO_URI is added in Render Environment Variables
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Connection Error:", err));

// 1. Static files (CSS, JS) serve karne ke liye
app.use(express.static(path.join(__dirname, "../"))); 

// 2. API Routes
const Book = require('./model/book');

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/books/search", async (req, res) => {
  try {
    const { q } = req.query;
    const books = await Book.find({ title: { $regex: q, $options: "i" } });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const { title, author, category, description, filePath } = req.body;
    const book = new Book({ title, author, category, description, filePath });
    await book.save();
    res.json({ message: "Book added successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Root route → serves index.html
// Corrected Syntax: Sabse niche ise hi rakhna
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});