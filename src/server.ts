import { Config } from "../src/config/config.ts";
import { app } from "./app.ts";
import { logger } from "./config/winston.ts";
import { connectToDatabase } from "./db.connection.ts";

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(Config.PORT, () => {
            logger.error("error.....");
            logger.info(`Listening on port: http://localhost:${Config.PORT}`);
        });
    } catch (err) {
        logger.error("Error starting server:", err);
        process.exit();
    }
}

startServer();
