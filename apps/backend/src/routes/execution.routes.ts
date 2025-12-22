import { Router } from "express"
import { deleteExecution, getAllExecutions, getExecutionById, getExecutionsStatus, getWorkflowExecutions, manualExecute, publicWebhookExecute, stopExecution, webhookExecute } from "../controllers/execution.controller"
import { auth } from "../middleware/auth"


const router = Router()

//public webhook endpoint - NO authentication required
router.post("/webhookExecute/:workflowId", publicWebhookExecute)

router.use(auth)

router.post("/workflow/:workflowId/execute", manualExecute)

router.post("/webhookExecute/:workflowId", webhookExecute);

router.get("/list", getAllExecutions);

router.get("/workflow/:workflowId/history", getWorkflowExecutions)

router.get("/:executionId/details", getExecutionById)

router.get("/:executionId/status", getExecutionsStatus);

router.post("/:executionId/stop", stopExecution);

router.delete("/:executionId", deleteExecution)


export default router;