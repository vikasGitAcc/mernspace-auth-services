import { Config } from "../src/config/config";
import { app } from "./app";
import { logger } from "./config/winston";

function startServer() {
    try {
        app.listen(Config.PORT, () => {
            logger.error("error.....");
            logger.info(`Listening on port: http://localhost:${Config.PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit();
    }
}

startServer();
