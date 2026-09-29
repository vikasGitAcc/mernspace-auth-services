import { Config } from "..";
import { app } from "./app";

function startServer() {
    try {
        app.listen(Config.PORT, () => {
            console.log(`Listening on port: http://localhost:${Config.PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
}

startServer();
