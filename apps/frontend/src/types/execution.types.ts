
export interface Execution {
    id: string;
    workflowId: string;
    status: ExecutionStatus;
    mode: "manual" | "trigger";
    startedAt: string;
    finishedAt?: string;
    data: ExecutionData;
    error?: string;
}

export type ExecutionStatus =
    | "running"
    | 'success'
    | 'error'
    | "stopped"
    | "canceled"

export interface ExecutionData {
    resultData: {
        runData: Record<string, NodeRunData[]>
    }
}

export interface NodeRunData {
    starteTime: number;
    executionTime: number;
    data: {
        main: Array<Array<{ json: any }>>;
    };
    error?: {
        message: string;
        description?: string
    }
}