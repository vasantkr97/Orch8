export interface CreateWorkflowData {
    title: string;
    isActive?: boolean;
    triggerType: string;
    nodes?: any;
    connections?: any
}

export interface UpdateWorkflowData {
    title?: string;
    isActive?: boolean;
    triggerType?: string;
    nodes?: any;
    connections?: any
}

