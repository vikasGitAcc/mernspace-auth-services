import type { Response, NextFunction } from "express";
import type { RegisterUserRequest } from "../types/user.types.ts";
import type { UserServices } from "../services/user.services.ts";
import type { Logger } from "winston";
import { validationResult } from "express-validator";
import type { TokenService } from "../services/token.services.ts";

export class AuthController {
    private userService: UserServices;
    constructor(
        service: UserServices,
        private logger: Logger,
        private tokenService: TokenService
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
                sub: String(userData.id),
                role: userData.role,
            };

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(userData);

            const accessToken = this.tokenService.generateAccessToken(payload);

            const refreshToken = this.tokenService.generateRefreshToken(
                payload,
                newRefreshToken
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
