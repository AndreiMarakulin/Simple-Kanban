require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 3000;

app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    "WORKING!!!": "",
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
