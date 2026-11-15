import type { Response, NextFunction } from "express";
import type { RegisterUserRequest } from "../types/user.types.ts";
import type { UserServices } from "../services/user.services.ts";
import type { Logger } from "winston";
// import createHttpError from "http-errors";
import { validationResult } from "express-validator";

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
            return res.status(201).json({ id: userData.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
