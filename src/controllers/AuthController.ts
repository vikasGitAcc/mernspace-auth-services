import type { Response, NextFunction } from "express";
import type { RegisterUserRequest } from "../types/user.types.ts";
import type { UserServices } from "../services/user.services.ts";
import type { Logger } from "winston";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { Config } from "../config/config.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AuthController {
    private userService: UserServices;
    constructor(
        service: UserServices,
        private logger: Logger
    ) {
        this.userService = service;
    }
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction
    ) {
        const { firstname, lastname, email, password } = req.body;

        this.logger.debug("Request for user registration received", {
            firstname,
            lastname,
            email,
            password: "*******",
        });

        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        try {
            const userData = await this.userService.create({
                firstname,
                lastname,
                email,
                password,
            });

            this.logger.info("User has been registered successfully", {
                user_id: userData.id,
            });

            const payload = {
                sub: userData.id,
                role: userData.role,
            };

            let privateKey: Buffer | string;

            try {
                privateKey = readFileSync(
                    path.join(__dirname, "../../certs/privateKey.pem"),
                    "utf-8"
                );
            } catch (err) {
                next(err);
                return;
            }

            const accessToken = jwt.sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn:
                    Config.ACCESS_TOKEN_EXPIRE as jwt.SignOptions["expiresIn"],
                issuer: "auth_service",
            });

            const refreshToken = jwt.sign(
                payload,
                Config.REFRESH_TOKEN_SECRET!,
                {
                    algorithm: "HS256",
                    expiresIn:
                        Config.REFRESH_TOKEN_EXPIRE as jwt.SignOptions["expiresIn"],
                    issuer: "auth_service",
                }
            );

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                httpOnly: true,
                sameSite: "strict",
                maxAge: 365 * 24 * 60 * 60 * 1000, // 1 Year
            });

            return res.status(201).json({ id: userData.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
