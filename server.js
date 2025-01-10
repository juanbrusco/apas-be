// Import the necessary modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const moodsRouter = require("./routes/apas");
const cors = require("cors"); // Import the cors module
const port = process.env.PORT || 3001;

// Create an instance of an Express application
const app = express();

// Use cors middleware to enable CORS
app.use(cors());

// Use bodyParser middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Create a new SQLite database connection
app.use("/apas", moodsRouter);

// Define a route that responds with "Hello World!" when a GET request is made
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server on port
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

