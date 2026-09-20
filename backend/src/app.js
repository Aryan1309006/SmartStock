const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieparser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-stock13.vercel.app",
  "https://smart-stock-68m4xleo-aryanpatil13092006-6572s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin, such as Postman
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

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
