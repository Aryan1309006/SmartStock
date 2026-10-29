const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://smart-stock13.vercel.app",
  "https://smart-stock-68m4xleo-aryanpatil13092006-6572s-projects.vercel.app",
];

const getAllowedOrigins = () => {
  const origins = new Set(defaultOrigins);

  if (process.env.CLIENT_URL) {
    origins.add(process.env.CLIENT_URL.replace(/\/$/, ""));
  }

  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim().replace(/\/$/, ""))
      .filter(Boolean)
      .forEach((o) => origins.add(o));
  }

  return Array.from(origins);
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin, such as Postman or mobile clients
    if (!origin) {
      return callback(null, true);
    }

    const allowed = getAllowedOrigins();
    if (allowed.includes(origin) || allowed.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

module.exports = { corsOptions, getAllowedOrigins };