import { Router } from "express";

const authController = require('../controllers/auth.controller.js');
const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get("/confirm/:confirmationCode", authController.verifyUser)

export default authRouter;