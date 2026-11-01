import { AppDataSource } from "./config/data_source.ts";
import { logger } from "./config/winston.ts";

async function connectToDatabase() {
    try {
        await AppDataSource.initialize();
        logger.info("PostgreSQL database connected successfully.");
    } catch (err) {
        logger.error("Error connecting to PostgreSQL database:", err);
    }
}

export { connectToDatabase };
