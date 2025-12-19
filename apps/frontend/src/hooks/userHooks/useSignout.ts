import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signout } from "../../services/auth.service";

const useSignout = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signout,
        onSuccess: () => {
            //clear all queries on signout
            queryClient.clear()

            queryClient.invalidateQueries({ queryKey: ["authUser"]})
        }
    });

    return {
        error,
        isPending,
        signout: mutate,
        isLoading: isPending
    }
}

export default useSignout;