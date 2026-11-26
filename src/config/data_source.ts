import { DataSource } from "typeorm";
import { User } from "../entity/user.entity.ts";
import { Config } from "./config.ts";
import { RefreshToken } from "../entity/refreshToken.entity.ts";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //Don't use it in the production, Keep it always false
    synchronize: false,
    logging: false,
    entities: [User, RefreshToken],
    migrations: [],
});
