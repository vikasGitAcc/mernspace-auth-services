import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserServices } from "../services/user.services";

const router = express.Router();

const userService = new UserServices();
const authController = new AuthController(userService);

router.post("/register", (req, res) => authController.register(req, res));

export default router;
