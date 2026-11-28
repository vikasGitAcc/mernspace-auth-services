import "reflect-metadata";
import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import type { HttpError } from "http-errors";
import authRouter from "./routes/auth.ts";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public", { dotfiles: "allow" }));
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Welcome");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const error = err.message;
    const statusCode = err.statusCode || err.status || 500;
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
