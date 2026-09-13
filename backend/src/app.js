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

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/dashboard", require("./routes/dashboard.route"));
app.use("/api/items", require("./routes/items.route"));
app.use("/api/notifications", require("./routes/notifications.route"));
app.use("/api/analytics", require("./routes/analytics.route"));
app.use("/api/recipes", require("./routes/suggest.route"));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});
module.exports = app;
