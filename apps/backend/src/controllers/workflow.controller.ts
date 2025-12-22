import type { Request, Response } from "express"
import { prisma } from "@orch8/db"
import crypto from "crypto"


export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const { title, isActive, triggerType, nodes, connections } = req.body

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated" })
        }

        if (!title || !triggerType || !nodes || !connections) {
            return res.status(400).json({ msg: "Missing required fields" })
        }

        //Ensure nodes and connections are arrays
        const workflowNodes = Array.isArray(nodes) ? nodes : []
        const workflowConnections = Array.isArray(connections) ? connections : []

        const webhookToken = triggerType === "WEBHOOK" ? crypto.randomBytes(32).toString('hex') : null

        const workflow = await prisma.workflow.create({
            data: {
                title,
                isActive,
                triggerType,
                nodes: workflowNodes,
                connections: workflowConnections,
                webhookToken,
                userId
            }
        })

        console.log(`Workflow created with ID: ${workflow.id}`)

        res.status(200).json({
            success: true,
            data: workflow,
            msg: "Workflow created successfully"
        })
    } catch (error: any) {
        console.error("Error creating workflow:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while creating workflow"
        })
    }
}

export const getallWorkflows = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated" })
        }

        const workflows = await prisma.workflow.findMany({
            where: {
                userId
            },
            include: {
                executions: {
                    select: { id: true, status: true, mode: true, startedAt: true, finishedAt: true },
                    orderBy: { createdAt: "desc" },
                    take: 10
                },
                _count: { select: { executions: true } }
            },
            orderBy: { updatedAt: "desc" }
        })

        res.status(200).json({
            success: true,
            data: workflows,
            count: workflows.length,
            msg: "Workflow fetched successfully"
        })
    } catch (error: any) {
        console.error("Error fetching workflows:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while fetching workflows"
        })
    }
}

export const getWorkflowById = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user?.id

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated" })
        }

        if (!workflowId) {
            return res.status(400).json({ msg: "Workflow ID is required" })
        }

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
                userId
            },
            include: {
                executions: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 10
                },
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        })

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" })
        }

        const nodes = workflow.nodes as any;
        const connections = workflow.connections as any;

        if (!Array.isArray(nodes) || !Array.isArray(connections)) {
            return res.status(400).json({ error: "Invalid workflow data" })
        }

        res.status(200).json({
            success: true,
            data: workflow,
            msg: "Workflow fetched successfully"
        })
    } catch (error: any) {
        console.error("Error fetching workflow:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while fetching workflow"
        })
    }
}

export const updateWorkflow = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const { workflowId } = req.params;

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated" })
        }

        if (!workflowId) {
            return res.status(400).json({ msg: "Workflow ID is required" })
        }

        const { title, isActive, nodes, triggerType, connections } = req.body;

        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId
            }
        })

        if (!existingWorkflow) {
            return res.status(404).json({ error: "Workflow not found" })
        }

        const updateData: any = {}

        if (title !== undefined) updateData.title = title
        if (isActive !== undefined) updateData.isActive = isActive;
        if (triggerType !== undefined) {
            updateData.triggerType = triggerType;
            //Generate webhook token if changing to webhook and does not have one
            if (triggerType === "webhook" && !(existingWorkflow as any).webhookToken) {
                updateData.webhookToken = crypto.randomBytes(32).toString('hex')
            }
        }

        if (nodes !== undefined) updateData.nodes = Array.isArray(nodes) ? nodes : [];
        if (connections !== undefined) updateData.connections = Array.isArray(connections) ? connections : [];

        const updateWorkflow = await prisma.workflow.update({
            where: { id: workflowId },
            data: updateData,
        })

        res.status(200).json({
            success: true,
            data: updateWorkflow,
            msg: "Workflow updated successfully"
        })
    } catch (error: any) {
        console.error("Error updating workflow:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while updating workflow"
        })
    }
}

export const deleteWorkflow = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params
        const userId = req.user?.id

        if (!userId) {
            return res.status(400).json({ msg: "User not Authenticated" })
        }

        if (!workflowId) {
            return res.status(400).json({ msg: "Workflow ID is required" })
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId: userId
            }
        })

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" })
        }

        await prisma.workflow.delete({
            where: { id: workflowId }
        })

        res.status(200).json({
            success: true,
            msg: "Workflow deleted successfully"
        })
    } catch (error: any) {
        console.error("Error deleting workflow:", error)
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Internal server error while deleting workflow"
        })
    }
}


