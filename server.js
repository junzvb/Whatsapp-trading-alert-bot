require("dotenv").config();
const express = require("express");
require("./scheduler");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trading Alert Bot Running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
