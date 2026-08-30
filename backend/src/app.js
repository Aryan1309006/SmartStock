const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToDB=require('./config/db')
connectToDB()

dotenv.config();
app.use(express.json);
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


app.use("/api/auth",require('./routes/auth.route'))
app.use('/api/')

module.exports = app;