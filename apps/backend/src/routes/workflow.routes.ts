import { Router } from "express";

const router = Router()

router.post("/createWorkflow", createWorkflow);

router.get("/getallWorkflows", getallWorkflows);

router.get("/getWorkflowById/:workflowId", getWorkflowById);

router.post("")