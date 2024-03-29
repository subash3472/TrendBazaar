const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const auth = require("./routes/auth");
const cookieparser = require("cookie-parser");

const products = require("./routes/product");
const order = require("./routes/order");

app.use(express.json());
app.use(cookieparser());

app.use("/api/v1/", products);
app.use("/api/v1/", auth);
app.use("/api/v1/", order);

// this is used for errorhandle
app.use(errorMiddleware);

module.exports = app;
