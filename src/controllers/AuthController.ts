import type { Response } from "express";
import { logger } from "../config/winston";
import type { RegisterUserRequest } from "../types/user.types.ts";
import type { UserServices } from "../services/user.services.ts";

export class AuthController {
    private userService: UserServices;
    constructor(service: UserServices) {
        this.userService = service;
    }
    async register(req: RegisterUserRequest, res: Response) {
        logger.info("Registering user with data: ", req.body);
        const { firstname, lastname, email, password } = req.body;
        const userData = await this.userService.create(
            firstname,
            lastname,
            email,
            password
        );

        logger.info("User Data: ", userData);

        res.status(201).json();
    }
}
