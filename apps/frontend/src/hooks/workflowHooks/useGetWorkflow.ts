import { useQuery } from "@tanstack/react-query"
import { getWorkflowById } from "../../services/workflow.service"


const useGetWorkflow = (workflowId: string) => {
    return useQuery({
        queryKey: ["workflows", workflowId],
        queryFn: () => getWorkflowById(workflowId), 
        retry: false,
        staleTime: 7 * 24 * 60 * 60 * 1000,
    })
}

export default useGetWorkflow;