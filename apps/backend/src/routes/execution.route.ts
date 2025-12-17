import { Router } from "express"
import { deleteExecution, getAllExecutions, getExecutionById, getExecutionsStatus, getWorkflowExecutions, manualExecute, publicWebhookExecute, stopExecution, webhookExecute } from "../controllers/execution.controller"
import { auth } from "../middleware/auth"


const router = Router()

//public webhook endpoint - NO authentication required
//Must be defined Before auth middleware
router.post("/webhookExecute/:workflowId", publicWebhookExecute)

router.use(auth)

router.post("/workflow/:workflowId/execute", manualExecute)

router.post("/webhookExecute/:workflowId", webhookExecute);

//get all executions for authenticated User
router.get("/list", getAllExecutions);

//Get execution history for a specific workflow
router.get("/workflow/:workflowId/history", getWorkflowExecutions)

//Get detailed information for specific execution by Id
router.get("/:executionId/details", getExecutionById)

router.get("/:executionId/status", getExecutionsStatus);

//Cancel/stop a running pending execution
router.post("/:executionId/stop", stopExecution);

//delete execution
router.delete("/:executionId", deleteExecution)


export default router;