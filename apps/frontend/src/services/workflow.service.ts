import { axiosInstance } from "../lib/axios";
import type { CreateWorkflowData, UpdateWorkflowData } from "../types/workflow.types";

export const createWorkflow = async (workflowData: CreateWorkflowData) => {
    const { data } = await axiosInstance.post("/workflows/createWorkflow", workflowData)
    return data;
}

export const getallWorkflows = async () => {
    const { data } = await axiosInstance.get("/workflows/getallworkflows")
    return data;
}

export const getWorkflowById = async (workflowId: string) => {
    const { data } = await axiosInstance.get(`/workflow/getWorkflowById/${workflowId}`)
    return data;
}

export const updateWorkflow = async (workflowId: string, updateWorkflowData: UpdateWorkflowData) => {
    const { data } = await axiosInstance.put(`/workflow/updateWorkflow/${workflowId}`, { updateWorkflowData })
    return data;
}

export const deleteWorkflow = async (workflowId: string) => {
    const { data } = await axiosInstance.delete(`/workflows/deleteWorkflow/${workflowId}`)
    return data;
}