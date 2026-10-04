import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import type { HttpError } from "http-errors";
// import { logger } from "./config/winston";

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const error = err.message;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: error,
                path: "",
                location: "",
            },
        ],
    });
});

export { app };
