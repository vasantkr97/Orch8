import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../../services/auth.service";


const useAuthUser = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false,
        staleTime: 7 * 24 * 60 * 60 * 1000,
    }) 
    return { isLoading, error, authUser: data?.user || null, isAuthenticated: !!data?.user } 
}

export default useAuthUser;