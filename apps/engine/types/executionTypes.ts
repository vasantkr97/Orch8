export interface WorkflowNode {
    id: string;
    name: string;
    type: "trigger" | "action";
    parameters: Record<string, any>;
    position: [number, number];
    webhook?: string;
    credentials?: Record<string, {id: string, name: string}>
}

export interface WorkflowConnection {
    id: string | number;
    source: string;
    target: string;
    type?: string;
}

export interface ExecutionContext {
    executionId: string;
    workflowId: string;
    userId: string;
    mode: "manual" | "webhook";
    data: Record<string, any>;
    nodeResults: Record<string, any>
}
