import { axiosInstance } from "../lib/axios";


export const manuaExecute = async (workflowId: string) => {
    const { data } = await axiosInstance.post(`/execution/workflow/${workflowId}/execute`)
    return data
}

export const webhookExecute = async (workflowId: string) => {
    const { data } = await axiosInstance.post(`/executions/webhookExecute/${workflowId}`)
    return data
}

export const getAllExecutions = async () => {
    const { data } = await axiosInstance.get("/executions/list");
    return data
}

export const getWorkflowExecution = async (workflowId: string) => {
    const { data } = await axiosInstance.get(`/executions/workflow/${workflowId}/history`)
    return data
}

export const getExecutionById = async (executionId: string) => {
    const { data } = await axiosInstance.get(`/executions/${executionId}/details`);
    return data
}

export const getExecutionStatus = async (executionId: string) => {
    const { data } = await axiosInstance.get(`/executions/${executionId}/status`);
    return data
}

export const stopExecution = async (executionId: string) => {
    const { data } = await axiosInstance.post(`/executions/${executionId}/stop`);
    return data;
}

export const deleteExecution = async (executionId: string) => {
    const { data } = await axiosInstance.delete(`/executions/${executionId}`);
    return data;
}