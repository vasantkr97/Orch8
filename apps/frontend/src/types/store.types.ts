import type { Execution } from "./execution.types";
import type { Workflow } from "./workflow.types";

export interface WorkflowState {
    currentWorkflow: Workflow | null;
    workflows: Workflow[];
    selectedNodeId: string | null;
    isLoading: boolean;
    error: string | null;
    hasUnsavedChanges: boolean;
}

export interface ExecutionState {
    executions: Execution[];
    currentExecution: Execution | null;
    isExecuting: boolean;
}

export interface UIState {
    isPanelOpen: boolean;
    panelType: "node" | 'execution' | 'null'
    isNodePaletteOpen: boolean;
    toast: ToastState | null;
}

export interface ToastState {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}