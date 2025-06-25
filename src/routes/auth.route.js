import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validations/validator.js";

const authRoute = express.Router();
authRoute.post("/login", validate(loginSchema),authController.login);
authRoute.post("/register", validate(registerSchema) ,authController.registerYup);
authRoute.get("/me", authController.getMe);

export default authRoute;