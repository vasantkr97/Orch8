import { Router } from "express";
import { auth } from "../middleware/auth";

export const authRouter = Router(); 

authRouter.use(auth)