import { prisma } from "@orch8/db"
import type { ExecutionContext, WorkflowConnection, WorkflowNode } from "../types/executionTypes";
import { executionTelegram } from "./nodeExecutors/telegramExecutor";
import { executeEmailNode } from "./nodeExecutors/emailExecutor";
import { executeGemini } from "./nodeExecutors/geminiExecutor";


export async function executeWorkflow(
    workflowId: string,
    userId: string,
    mode: "manual" | "webhook"
): Promise<string> {

    if (!workflowId || !userId) {
        throw new Error("WOrkflow ID and User ID are requried");
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
            nodeResults: {}
        }

        const triggerTypes = ["trigger", "manual", "webhook", "schedule", "cron"]

        const triggerNode = nodes.find((node) => triggerTypes.some(t => node.type?.toLowerCase().includes(t)))

        if (!triggerNode) {
            throw new Error(
                "No trigger node found. Please add a trigger node (webhook, manual, or schedule) to your workflow."
            );
        }

        console.log(`Starting from trigger: ${triggerNode.name} (${triggerNode.type})`);

        const results = await executeNodeChain(
            triggerNode,
            nodes,
            connections,
            context
        )

        await prisma.execution.update({
            where: { id: executionId },
            data: {
                status: "success",
                results: safeClone(results),
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
                    errorType: error.constructor.name,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                    executionId
                },
                finishedAt: new Date()
            }
        })
    }
}


async function executeNodeChain(
    currentNode: WorkflowNode,
    allNodes: WorkflowNode[],
    connections: WorkflowConnection[],
    context: ExecutionContext,
    previousNodeId?: string,
    visitedNodes?: Set<string>
): Promise<any> {

    visitedNodes = visitedNodes ?? new Set<string>()

    const currentNodeId = (currentNode as any).id //|| currentNode.name || `node_${Date.now()}`

    if (!currentNodeId) {
        throw new Error(`Node "${currentNode.name}" is missing an id`)
    }

    if (visitedNodes.has(currentNodeId)) {
        console.warn(`Cycle detected: Node ${currentNode.name} (${currentNodeId}) already visited. ` + `Skipping to prevent infinite loop.`)
        return context.nodeResults[currentNodeId];
    }

    visitedNodes.add(currentNodeId)

    let nodeResult;

    try {
        console.log(`[DEBUG] Executing node: ${currentNode.name}, Type: ${currentNode.type}, ID: ${currentNodeId}`);
        nodeResult = await executeNode(currentNode, context, previousNodeId);
    } catch (error: any) {
        console.error(`[DEBUG] Execution failed for node ${currentNode.name}:`, error)
        nodeResult = {
            success: false,
            error: error.message,
            nodeName: currentNode.name,
            timestamp: new Date().toISOString()
        };
    }

    const safeNodeResult = safeClone(nodeResult)

    //Improved duplicate name handling with array structure
    if (context.nodeResults[currentNodeId]) {
        const existing = context.nodeResults[currentNodeId]
        context.nodeResults[currentNodeId] = Array.isArray(existing) ? [...existing, safeNodeResult] : [existing, safeNodeResult];
    } else {
        context.nodeResults[currentNodeId] = safeNodeResult;
    }


    if (nodeResult?.success && nodeResult.data !== undefined) {
        const key = (currentNode as any).id || currentNode.name;
        if (!context.data) {
            context.data = {}
        }
        (context.data as any)[key] = safeClone(nodeResult.data);
    }

    //finding next node to execute
    const nextEdges = connections.filter(conn =>
        conn.source === currentNodeId
    )

    //return if no next nodes
    if (nextEdges.length === 0) {
        console.log(`End of chain reached at: ${currentNode.name}`)
        return nodeResult;
    }

    const targetKeys = [...new Set(nextEdges.map(conn => conn.target))]
    const nextNodes = allNodes.filter(node => {
        const nodeId = (node as any).id;
        return (nodeId && targetKeys.includes(nodeId)) || targetKeys.includes(node.name)
    })

    if (!nextNodes.length) {
        console.log(`Branching to `)
        return nodeResult;
    }

    for (const nextNode of nextNodes) {

        //create new Set for each branch to allow parallel paths
        const branchVisited = new Set(visitedNodes)

        //real parallel execution
        // await Promise.all(
        //     nextNodes.map(nextNode => executeNodeChain(
        //         nextNode,
        //         allNodes,
        //         connections,
        //         context,
        //         currentNodeId,
        //         branchVisited
        //     ))
        // )

        await executeNodeChain(
            nextNode,
            allNodes,
            connections,
            context,
            currentNodeId,
            branchVisited
        );

    }

    return context.nodeResults;

}


//Executes a single node based on its type

async function executeNode(
    node: WorkflowNode,
    context: ExecutionContext,
    previousNodeId?: string
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

            result = await executionTelegram(node, context, credentialId ?? "", previousNodeId);
        
        } else if (nodeType.includes("email")) {
            
            result = await executeEmailNode(node, context, credentialId ?? "", previousNodeId);
        
        } else if (nodeType.includes("gemini")) {
            
            result = await executeGemini(node, context, credentialId ?? "", previousNodeId);
        
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

    // Handle flat structure: { "id": "..." }
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

