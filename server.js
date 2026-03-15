const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// 1. Body parser
app.use(express.json());

// 2. MongoDB connection
// Make sure MONGO_URI is in Render Environment Variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Connection Error ❌:", err));

// 3. Static files serve karein (CSS, JS, Images)
// path.join(__dirname, "../") ka matlab hai server folder se bahar nikal kar index.html dhoondna
app.use(express.static(path.join(__dirname, "../"))); 

// 4. API Routes
const Book = require('./model/book');

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json({ message: "Book added successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Root Route (The "PathError" Fix)
// Node v22 aur naye Express mein '*' sabse best chalta hai
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// 6. Port logic for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});