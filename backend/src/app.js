const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieparser = require("cookie-parser");
const cors = require("./config/cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors);

app.use("/api/auth",require('./routes/auth.route'))
app.use("/api",require('./routes/dashboard.route'))
app.use("/api",require('./routes/items.route'))

module.exports = app;