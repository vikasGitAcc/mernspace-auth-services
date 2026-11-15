import express from "express";
import type { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController.ts";
import { UserServices } from "../services/user.services";
import { AppDataSource } from "../config/data_source.ts";
import { User } from "../entity/user.entity.ts";
import { logger } from "../config/winston.ts";
import registerValidators from "../validators/register-validators.ts";

const router = express.Router();
const userRespository = AppDataSource.getRepository(User);
const userService = new UserServices(userRespository);
const authController = new AuthController(userService, logger);

router.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next)
);

export default router;
