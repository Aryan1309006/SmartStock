const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const { corsOptions } = require("./config/cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Domain routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/dashboard", require("./routes/dashboard.route"));
app.use("/api/items", require("./routes/items.route"));
app.use("/api/notifications", require("./routes/notifications.route"));
app.use("/api/analytics", require("./routes/analytics.route"));
app.use("/api/recipes", require("./routes/suggest.route"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartStock API is running",
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
