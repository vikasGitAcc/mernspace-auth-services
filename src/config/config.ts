import { config } from "dotenv";

config();

const { PORT, APP_MODE } = process.env;

const Config = {
    PORT,
    APP_MODE,
};

export { Config };
