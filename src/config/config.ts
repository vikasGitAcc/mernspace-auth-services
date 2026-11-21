import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url);
const __root_dir = path.resolve(__dirname, "../../../");
config({
    path: path.join(__root_dir, `.env.${process.env.NODE_ENV}`),
    quiet: true,
});

const {
    PORT,
    NODE_ENV,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_HOST,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRE,
    ACCESS_TOKEN_EXPIRE,
} = process.env;

const Config = {
    PORT,
    NODE_ENV,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_HOST,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,
};

export { Config };
