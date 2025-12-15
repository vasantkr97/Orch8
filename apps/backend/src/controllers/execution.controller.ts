import type { Request, Response } from "express";
import { prisma } from "@orch8/db"


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

        const executionId = await executeWorkflow(workflowId, userId, "MANUAL")

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
            
        })
    }
}