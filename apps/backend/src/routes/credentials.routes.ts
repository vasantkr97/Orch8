import { Router } from "express";
import { deleteCredentials, getCredentialById, getCredentials, postCredentials, updateCredentials } from "../controllers/credentials.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.use(auth)

router.post("/postCredentials", postCredentials);

router.get("/getCredentials", getCredentials);

router.get("/getCredentialById/:id", getCredentialById);

router.put("/updateCredentials/:id", updateCredentials);

router.delete("/deleteCredentials/:id", deleteCredentials);


export default router