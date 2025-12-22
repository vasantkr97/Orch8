import { prisma } from "@orch8/db"
import type { ExecutionContext, WorkflowConnection, WorkflowNode } from "../types/executionTypes";
import { executeTelegram } from "./nodeExecutors/telegramExecutor";
import { executeEmailNode } from "./nodeExecutors/emailExecutor";
import { executeGemini } from "./nodeExecutors/geminiExecutor";



export async function executeWorkflow(
    workflowId: string,
    userId: string,
    mode: "manual" | "webhook"
): Promise<string> {

    if (!workflowId || !userId) {
        throw new Error("Workflow ID and User ID are required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        }
    })

    if (!workflow) {
        throw new Error(`Workflow not found ${workflowId}`);
    }

    if (!workflow.isActive) {
        await prisma.workflow.update({
            where: { id: workflowId },
            data: { isActive: true }
        })
    }

    const execution = await prisma.execution.create({
        data: {
            workflowId,
            userId,
            mode: mode as any,
            status: "pending",
            startedAt: new Date(),
            data: {}
        }
    })

    executeInBackground(execution.id, workflowId, userId, mode).catch((err: any) => {
        console.error(`Background execution failed for ${execution.id}: `, err);
    })

    return execution.id;
}


//Executes workflow in background to avoid blocking the main thread 
async function executeInBackground(
    executionId: string,
    workflowId: string,
    userId: string,
    mode: "manual" | "webhook"
): Promise<void> {
    try {
        await prisma.execution.update({
            where: { id: executionId },
            data: { status: "running" }
        })

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
                userId
            }
        })

        if (!workflow) {
            throw new Error(`Workflow not found ${workflowId}`)
        }

        if (!workflow.nodes || !workflow.connections) {
            throw new Error("Workflow is missing nodes or connections")
        }

        const nodes = workflow.nodes as unknown as WorkflowNode[]
        const connections = workflow.connections as unknown as WorkflowConnection[]

        if (nodes.length === 0) {
            throw new Error("Workflow has no nodes to Execute");
        }

        const context: ExecutionContext = {
            workflowId,
            executionId,
            userId,
            mode,
            data: {},
            nodeResults: {},
            executionOrder: []  // Track exact execution order for frontend visualization
        }

        const triggerTypes = ["manual", "webhook", "schedule", "cron"]

        const triggerNode = nodes.find((node) => triggerTypes.some(t => node.type?.toLowerCase().includes(t)))

        if (!triggerNode) {
            throw new Error(
                "No trigger node found. Please add a trigger node (webhook, manual, or schedule) to your workflow."
            );
        }

        console.log(`Starting from trigger: ${triggerNode.name} (${triggerNode.type})`);


        //in degree and adg list
        const inDegreeMap = new Map<string, number>();
        const adjacencyMap = new Map<string, string[]>();

        for (const node of nodes) {
            inDegreeMap.set(node.id, 0);
            adjacencyMap.set(node.id, [])
        }

        for (const conn of connections) {
            adjacencyMap.get(conn.source)?.push(conn.target)
            inDegreeMap.set(conn.target, (inDegreeMap.get(conn.target) || 0) + 1);
        }

        await executeWorkflowGraph(
            triggerNode,
            nodes,
            context,
            adjacencyMap,
            inDegreeMap
        )

        // Execution is only "success" if ALL nodes executed successfully
        const allNodeResults = Object.values(context.nodeResults);
        const hasFailure = allNodeResults.some((result: any) => {
            // Handle both single results and arrays of results
            if (Array.isArray(result)) { 
                return result.some((r: any) => r.success === false);
            }
            return result.success === false;
        });

        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: hasFailure ? "failed" : "success",
                results: {
                    nodeResults: safeClone(context.nodeResults),
                    executionOrder: context.executionOrder  // Include execution order for frontend
                },
                finishedAt: new Date()
            }
        })

    } catch (error: any) {
        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: "failed",
                results: {
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                },
                finishedAt: new Date()
            }
        })
    }
}


async function executeWorkflowGraph(
    triggerNode: WorkflowNode,
    allNodes: WorkflowNode[],
    context: ExecutionContext,
    adjacencyMap: Map<string, string[]>,
    inDegreeMap: Map<string, number>,
): Promise<any> {

    const nodeMap = new Map(allNodes.map(n => [n.id, n]));
    const queue: WorkflowNode[] = [];
    const executed = new Set<string>();

    queue.push(triggerNode);

    while (queue.length > 0) {
        const node = queue.shift()!;
        const nodeId = node.id;

        if (executed.has(nodeId)) continue;
        executed.add(nodeId);

        // Update DB to show this node is now executing
        console.log(`Starting node: ${node.name}`);
        await prisma.execution.update({
            where: { id: context.executionId },
            data: {
                results: {
                    nodeResults: safeClone(context.nodeResults),
                    executionOrder: context.executionOrder,
                    currentNode: nodeId,  // Currently executing node
                    completedNodes: [...context.executionOrder]  // Already completed nodes
                }
            }
        });

        console.log(`Waiting 5 seconds (node: ${node.name})...`);
        await new Promise(resolve => setTimeout(resolve, 3000));

        let result;
        try {
            result = await executeNode(node, context);
        } catch (error: any) {
            result = {
                success: false,
                error: error.message,
                nodeName: node.name,
                timestamp: new Date().toISOString()
            }
        }

        context.nodeResults[nodeId] = safeClone(result);
        context.executionOrder.push(nodeId);  

        // Update DB to show this node completed
        console.log(`Completed node: ${node.name}`);
        await prisma.execution.update({
            where: { id: context.executionId },
            data: {
                results: {
                    nodeResults: safeClone(context.nodeResults),
                    executionOrder: context.executionOrder,
                    currentNode: null,  // No node currently executing
                    completedNodes: [...context.executionOrder]
                }
            }
        });

        if (result?.success && result.data !== undefined) {
            context.data[nodeId] = safeClone(result.data);
        }

        //release children for executeion into queue when all parents finished
        for (const childId of adjacencyMap.get(nodeId) || []) {
            const remaining = (inDegreeMap.get(childId) || 0) - 1;
            inDegreeMap.set(childId, remaining);
            if (remaining === 0) {
                const childNode = nodeMap.get(childId);
                if (childNode) {
                    queue.push(childNode);
                }
            }
        }
    }
}


//Executes a single node based on its type
async function executeNode(
    node: WorkflowNode,
    context: ExecutionContext,
): Promise<any> {

    if (!node.type) {
        throw new Error(`Node ${node.name} is missing a type`);
    }

    const triggerTypes = ["manual", "webhook", "schedule", "cron"]
    const isTrigger = triggerTypes.some(type =>
        node.type?.toLowerCase().includes(type)
    )

    const startedAt = new Date();
    let result: any;

    if (isTrigger) {
        console.log(`Trigger node executed: ${node.name}`)
        result = {
            success: true,
            data: context.data || {},
            timestamp: new Date().toISOString(),
            nodeType: node.type
        }
    } else {

        const credentialId = extractCredentialId(node)
        const nodeType = node.type.toLowerCase();

        if (nodeType.includes("telegram")) {

            result = await executeTelegram(node, context, credentialId ?? "");

        } else if (nodeType.includes("email")) {

            result = await executeEmailNode(node, context, credentialId ?? "");

        } else if (nodeType.includes("gemini")) {

            result = await executeGemini(node, context, credentialId ?? "");

        } else {

            throw new Error(`Unsupported node type: ${node.type}`)

        }
    }

    const finishedAt = new Date();
    return {
        ...result,
        startedAt,
        finishedAt
    }
}


function extractCredentialId(node: WorkflowNode): string | null {
    if (!node.credentials) {
        return null;
    }

    if (node.credentials.id && typeof node.credentials.id === 'string') {
        return node.credentials.id;
    }

    // Handle nested structure: { "serviceName": { "id": "..." } }
    const credentialKeys = Object.keys(node.credentials);
    if (credentialKeys.length === 0) {
        return null;
    }

    // Find the first key that has an object with an 'id' property
    for (const key of credentialKeys) {
        const credentialInfo = node.credentials[key];
        if (credentialInfo && typeof credentialInfo === 'object' && credentialInfo.id) {
            return credentialInfo.id;
        }
    }

    return null;
}





function safeClone(
    obj: any,
    maxDepth = 10,
    depth = 0,
    seen = new WeakSet<object>()
): any {

    if (seen.has(obj)) {
        return '[Circular Reference]';
    }

    if (depth > maxDepth) {
        return '[Max Depth Reached]'
    }

    if (obj === null || typeof obj !== "object") {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime())
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj)
    }

    if (obj instanceof Set) {
        return new Set(Array.from(obj).map(item => safeClone(item, maxDepth, depth + 1, seen)))
    }

    if (obj instanceof Map) {
        const cloned = new Map();
        obj.forEach((value, key) => {
            cloned.set(key, safeClone(value, maxDepth, depth + 1, seen))
        })

        return cloned
    }

    seen.add(obj)

    if (Array.isArray(obj)) {
        return obj.map(item => safeClone(item, maxDepth, depth + 1, seen))
    }

    const cloned: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = safeClone(obj[key], maxDepth, depth + 1, seen);
        }
    }

    return cloned;
}

