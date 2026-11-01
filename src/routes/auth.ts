import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserServices } from "../services/user.services";
import { AppDataSource } from "../config/data_source";
import { User } from "../entity/user.entity";
import { logger } from "../config/winston";

const router = express.Router();
const userRespository = AppDataSource.getRepository(User);
const userService = new UserServices(userRespository);
const authController = new AuthController(userService, logger);

router.post("/register", (req, res, next) =>
    authController.register(req, res, next)
);

export default router;
