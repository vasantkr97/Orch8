import type { Request, Response } from "express";
import { prisma } from "@orch8/db"
import { executeWorkflow } from "@orch8/engine"


export const manualExecute = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated"})
        }

        if (!workflowId) {
            return res.status(404).json({
                error:  "UNauthorized",
                msg: "Workflow ID is required"
            });
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            }
        });

        if (!workflow) {
            return res.status(404).json({ 
                error: "workflow not found or access denied",
            })
        }

        const executionId = await executeWorkflow(workflowId, userId, "manual")

        res.status(200).json({
            success: true,
            data: {
                executionId: executionId,
                message: "Workflow execution started successfully"
            }
        })
    } catch (error) {
        console.error("Error running workflow:", error);
        res.status(500).json({ error: "Internal server error"})
    }
};

export const webhookExecute = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated"})
        }

        if (!workflowId) {
            return res.status(404).json({
                error: "Unauthorized",
                msg: "Workflow ID is required"
            })
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            }
        })

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found or access denied"})
        }

        const executionId = await executeWorkflow(workflowId, userId, "webhook");

        return res.status(200).json({
            success: true,
            data: {
                executionId,
                message: "Webhook workflow triggered successfully"
            }
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message })
    }
}

export const publicWebhookExecute = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params

        const tokenFromQuery = req.query.token as string;
        const tokenFromHeader = req.headers["x-webhook-token"] as string;
        const providedToken = tokenFromQuery || tokenFromHeader;

        console.log(`Public webhook triggered for workflow: ${workflowId}`)

        if (!providedToken) {
            return res.status(401).json({
                success: false,
                error: "Webhook token is required. Please provide token in query parameter (?token=xxx) or X-Webhook-Token header."
            })
        }

        if (!workflowId) {
            return res.status(404).json({
                error: "Unauthorized",
                msg: "Workflow ID is required"
            })
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                isActive: true,
                webhookToken: providedToken
            } as any,
        })

        if (!workflow) {
            console.log("Webhook authenticated failed for workflow:", workflowId)
            return res.status(403).json({
                success: false,
                error: "Invalid webhook token or workflow not found/active. Please check your token and ensure the workflow is active."
            })
        }

        console.log(`Webhook authenticated for workflow: ${workflowId}`);

        //Execute the workflow with the workflow owner's userId
        const executionId = await executeWorkflow(workflowId, workflow.userId, "webhook")

        return res.status(200).json({
            success: true,
            data: {
                executionId,
                msg: "Webhook executed Successfully",
                workflowId: workflowId
            }
        })
    } catch (error: any) {
        console.error("Public Webhook execution error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to execute webhook"
        })
    }
}


export const getExecutionById = async (req: Request, res: Response) => {
    try {
        const { executionId } = req.params;
        const  userId  = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                msg: "User not authenticated"
            })
        }

        const execution = await prisma.execution.findFirst({
            where: { id: executionId, userId },
            include: {
                workflow: {
                    select: {
                        id: true,
                        title: true,
                        triggerType: true
                    }
                }
            }
        })

        if (!execution) {
            return res.status(404).json({ msg: "Execution not found or Access denied!"})
        }

        res.status(200).json({
            success: true,
            data: execution
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while fetching execution By Id"
        })
    }
}


export const getAllExecutions = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { status, workflowId, mode } = req.query;

        const where: any = {
            userId
        }

        if (status) {
            where.status = status
        }

        if (workflowId) {
            where.workflowId = workflowId
        }

        if (mode) {
            where.mode = mode
        }

        const executions = await prisma.execution.findMany({
            where,
            include: {
                workflow: {
                    select: {
                        id: true,
                        title: true,
                        triggerType: true
                    }
                }
            },
            orderBy: { createdAt: "desc"}
        });

        const total = await prisma.execution.count({
            where
        })

        res.json({
            executions,
            total
        })
    } catch (error: any) {
        console.error("Get all executions error:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while fetching executions"
        })
    }
}

export const getWorkflowExecutions = async (req: Request, res: Response)=>{
    try {
        const { workflowId } = req.params;
        const { status } = req.query;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ msg: "User not Authenticated"})
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId
            }
        })

        if(!workflow) {
            return res.status(404).json({ msg: "Workflow not found or access denied"})
        }

        const whereClause: any = {
            workflowId,
            userId
        }

        if (status) {
            whereClause.status = status
        }

        const executions = await prisma.execution.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc"
            }
        })

        const totalCount = await prisma.execution.count({
            where: whereClause
        })

        return res.status(200).json({
            success: true,
            data: executions,
            count: executions.length,
            totalCount
        })
    } catch (error: any) {
        console.error("Get workflow executions error:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while fetching executions"
        })
    }
}

export const getExecutionsStatus = async (req: Request, res: Response) => {
    try {
        const { executionId } = req.params;

        const execution = await prisma.execution.findFirst({
            where: {
                id: executionId,
                userId: req.user?.id
            },
            include: {
                workflow: {
                    select: {
                        title: true
                    }
                }
            }
        })

        if (!execution) {
            return res.status(404).json({ error: "Execution not found or access denied"})
        }

        return res.status(200).json({
            success: true,
            data: execution
        })
    } catch (error: any) {
        console.error("Get execution status error:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while fetching execution status"
        })
    }
}

export const stopExecution = async (req: Request, res: Response) => {
    try {
        const { executionId } = req.params;
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated"})
        }
        if (!executionId) {
            return res.status(400).json({ error: "Execution ID is required"})
        }

        const execution = await prisma.execution.findFirst({
            where: {
                id: executionId,
                userId
            }
        })

        if (!execution) {
            return res.status(404).json({ error: "Execution not found or access denied"})
        }

        if (execution.status !== "running" && execution.status !== "pending") {
            return res.status(400).json({ error: "Cannot stop execution that is not running or pending"})
        }

        const updatedExecution = await prisma.execution.update({
            where: {
                id: executionId
            },
            data: {
                status: "stopped",
                finishedAt: new Date(),
                results: {
                    error: "Execution stopped by user",
                    stopped: true
                }
            }
        })

        return res.status(200).json({
            success: true,
            data: updatedExecution
        })
    } catch (error: any) {
        console.error("Stop execution error:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while stopping execution"
        })
    }
}


export const deleteExecution = async (req: Request, res: Response) => {
    try {
        const { executionId } = req.params
        const userId = req.user?.id

        console.log(`Deleting execution ${executionId} for user ${userId}`)

        if (!userId) {
            return res.status(400).json({ error: "User not Authenticated"})
        }

        const execution = await prisma.execution.findFirst({
            where: { id: executionId, userId }
        })

        if (!execution) {
            return res.status(404).json({ error: "Execution not found or access denied"})
        }

        await prisma.execution.delete({
            where: {
                id: executionId,
                userId
            }
        })

        return res.status(200).json({
            success: true,
            msg: "Execution deleted successfully"
        })
    
    } catch (error: any) {
        console.error("Delete execution error:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while deleting execution"
        })
    }
}