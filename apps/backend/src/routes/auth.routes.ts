import { Router } from "express"
import { getMe, signin, signout, signup } from "../controllers/auth.controller"
import { auth } from "../middleware/auth";

const router = Router()

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);

router.get("/me", auth, getMe);

export default router
