import express from "express";
import type { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController.ts";
import { UserServices } from "../services/user.services";
import { AppDataSource } from "../config/data_source.ts";
import { User } from "../entity/user.entity.ts";
import { logger } from "../config/winston.ts";
import registerValidators from "../validators/register-validators.ts";
import { TokenService } from "../services/token.services.ts";
import { RefreshToken } from "../entity/refreshToken.entity.ts";

const router = express.Router();
const userRespository = AppDataSource.getRepository(User);
const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
const userService = new UserServices(userRespository);
const tokenService = new TokenService(refreshTokenRepo);
const authController = new AuthController(userService, logger, tokenService);

router.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next)
);

export default router;
