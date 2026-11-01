import { DataSource } from "typeorm";
import { User } from "../entity/user.entity.ts";
import { Config } from "./config.ts";
import { logger } from "./winston.ts";

logger.info("Host: ", Config.DB_HOST);
logger.info("PORT: ", Config.DB_PORT);
logger.info("USERNAME: ", Config.DB_USERNAME);
logger.info("PASSWORD: ", Config.DB_PASSWORD);
logger.info("NAME: ", Config.DB_NAME);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST || "localhost",
    port: Number(Config.DB_PORT) || 5432,
    username: Config.DB_USERNAME || "root",
    password: Config.DB_PASSWORD || "root",
    database: Config.DB_NAME || "",
    //Don't use it in the production
    synchronize: Config.NODE_ENV === "dev" || Config.NODE_ENV === "test",
    logging: false,
    entities: [User],
    migrations: [],
});
