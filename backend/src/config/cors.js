const cors = require('cors');

// Define allowed origins based on environment
const allowedOrigins = {
  development: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  production: ['https://smartstock-frontend.vercel.app'],
};

// Get origins based on NODE_ENV
const getOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return allowedOrigins.production;
  }
  return [...allowedOrigins.development, ...allowedOrigins.production];
};

// CORS options configuration
const corsOptions = {
  // Dynamic origin check
  origin: function (origin, callback) {
    const origins = getOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed request headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  
  // Expose response headers to client
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  
  // Browser cache preflight requests for 24 hours
  maxAge: 86400,
  
  // Allow same site requests
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);