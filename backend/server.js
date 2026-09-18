import dns from "dns";
import "dotenv/config";

import app from "./src/app.js";
import connectDb from "./config/db.js";

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();