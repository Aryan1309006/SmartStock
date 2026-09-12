const jwt=require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const headerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;
        const token = headerToken || req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach user information to request
        req.user = {
            userId: decoded.userId,
        };

        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};

module.exports = { protect };