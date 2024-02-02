const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const auth = require("./routes/auth");

const products = require("./routes/product");

app.use(express.json());

app.use("/api/v1/", products);
app.use("/api/v1/", auth);

// this is used for errorhandle
app.use(errorMiddleware);

module.exports = app;
