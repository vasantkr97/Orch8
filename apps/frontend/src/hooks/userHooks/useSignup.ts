import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../../services/auth.service"

const useSignup = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["authUser"]
        }),
        onError: (error: any) => {
            console.error("Signup error:", error);
        }
    })

    return { isPending, error, signup: mutate, isLoading: isPending };
}

export default useSignup;