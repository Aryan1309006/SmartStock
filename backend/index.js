const app = require("./src/app");
const connectToDB = require("./src/config/db");

const startServer = async () => {
  try {
    await connectToDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
