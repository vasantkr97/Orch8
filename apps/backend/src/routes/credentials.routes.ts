import { Router } from "express";
import { deleteCredentials, getCredentialById, getCredentials, postCredentials, updateCredentials } from "../controllers/credentials.controller";

const router = Router()

router.post("/postCredentials", postCredentials);

router.post("/getCredentials", getCredentials);

router.get("/getCredentialById/:id", getCredentialById);

router.put("/updateCredentials/:id", updateCredentials);

router.delete("/deleteCredentials/:id", deleteCredentials);


export default router