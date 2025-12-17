import { Router } from "express";
import { createWorkflow, deleteWorkflow, getallWorkflows, getWorkflowById, updateWorkflow } from "../controllers/workflow.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.use(auth)

router.post("/createWorkflow", createWorkflow);

router.get("/getallWorkflows", getallWorkflows);

router.get("/getWorkflowById/:workflowId", getWorkflowById);

router.post("/updateWorkflow/:workflowId", updateWorkflow);

router.delete("/deleteWorkflow/:workflowId", deleteWorkflow);

export default router