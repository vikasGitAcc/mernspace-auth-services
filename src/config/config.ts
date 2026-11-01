import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url);
const __root_dir = path.resolve(__dirname, "../../../");
config({
    path: path.join(__root_dir, `.env.${process.env.NODE_ENV}`),
    quiet: true,
});

const { PORT, NODE_ENV, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_HOST } =
    process.env;

const Config = {
    PORT,
    NODE_ENV,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_HOST,
};

export { Config };
