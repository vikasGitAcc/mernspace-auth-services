import winston from "winston";
import { Config } from "./config";

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
            silent: Config.APP_MODE == "test",
        }),
        new winston.transports.File({
            level: "info",
            dirname: "logger",
            filename: "combine.info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            silent: Config.APP_MODE == "test",
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            silent: Config.APP_MODE == "test",
        }),
    ],
});

export { logger };
