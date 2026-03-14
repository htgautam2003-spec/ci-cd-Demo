const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// Body parser
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Routes

// Root route → serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Book model
const Book = require("./models/Book");

// API: Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Search books
app.get("/api/books/search", async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({ title: { $regex: q, $options: "i" } });
  res.json(books);
});

// API: Add book (Admin)
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

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});