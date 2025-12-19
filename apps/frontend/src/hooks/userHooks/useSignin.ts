import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signin } from "../../services/auth.service";

const useSignin = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signin,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["authUser"]
            })
        },
        onError: (error: any) => {
            console.error("signin error:", error);
        }
    })

    return{
        error: error?.response?.data?.message || error?.message || "Signin failed",
        isPending,
        signin: mutate,
        isLoading: isPending
    }
}

export default useSignin;