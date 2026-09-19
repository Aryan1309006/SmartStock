const mongoose = require("mongoose");
const dns = require("dns");

// In local development or restricted networks, Node's c-ares DNS resolver can fail
// on MongoDB Atlas SRV lookup (`querySrv ECONNREFUSED`).
// We apply fallback public DNS servers in development or when explicitly requested via CUSTOM_DNS,
// avoiding interference with enterprise VPC / private cloud DNS in production.
if (process.env.NODE_ENV !== "production" || process.env.CUSTOM_DNS) {
    try {
        const servers = process.env.CUSTOM_DNS
            ? process.env.CUSTOM_DNS.split(",")
            : ["8.8.8.8", "8.8.4.4"];
        dns.setServers(servers);
    } catch (err) {
        console.warn("Warning: Failed to set custom DNS servers:", err.message);
    }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in environment variables (.env)");
}

// Global cached connection for serverless / hot-reloading environments
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// Options optimized for connection pool limits and network resiliency
const mongooseOptions = {
    maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE) || 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connection established successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB connection lost");
        });

        cached.promise = mongoose
            .connect(MONGODB_URI, mongooseOptions)
            .then((m) => m)
            .catch((error) => {
                cached.promise = null;
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Handle graceful shutdown for process termination signals (Docker, Kubernetes, PM2, Cloud hosting)
const gracefulShutdown = async (signal) => {
    if (mongoose.connection.readyState === 1) {
        console.log(`Received ${signal}. Closing MongoDB connection...`);
        await mongoose.connection.close();
        console.log("MongoDB connection gracefully closed.");
    }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

module.exports = connectDB;