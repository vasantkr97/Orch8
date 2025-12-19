import { useMutation, useQueryClient } from "@tanstack/react-query";
import { manualExecute } from "../../services/execution.service";

export const useMunualExecution = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (workflowId: string) => manualExecute(workflowId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["execution-history"]
            })
            return data
        },
        onError: (error: any) => {
            console.error("Workflow execution error:", error?.response?.data?.error || "failed")
        }
    })
}