import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkflow } from "../../services/workflow.service";

const useCreateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWorkflow,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workflows"]
            })
        },
        onError: (error: any) => {
            console.error("Workflow creation error:", error?.response?.data?.error || "failed")
        }
    })
}

export default useCreateWorkflow;