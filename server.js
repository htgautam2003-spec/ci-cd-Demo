const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Important

app.get("/api", (req, res) => {
  res.json({
    name: "Gautam",
    project: "E-Book Library",
    status: "Backend Connected 🚀"
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
