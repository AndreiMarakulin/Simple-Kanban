require("dotenv").config();
const express = require("express");
const errorHadler = require("./src/middleware/ErrorHandlingMiddleware");

const api = require("./src/routes");

const PORT = process.env.PORT || 3000;

app = express();

app.use(express.json());
app.use("/api", api);

app.use(errorHadler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
