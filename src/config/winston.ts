import winston from "winston";
import { Config } from "./config.ts";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        service: "auth_services",
    },
    transports: [
        new winston.transports.File({
            level: "error",
            dirname: "logger",
            filename: "console.error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            silent: Config.NODE_ENV == "test",
        }),
        new winston.transports.File({
            level: "info",
            dirname: "logger",
            filename: "combine.info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            silent: Config.NODE_ENV == "test",
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            silent: Config.NODE_ENV == "test",
        }),
    ],
});

export { logger };
