import { axiosInstance } from "../lib/axios";
import type { SigninData, SignupData } from "../types/auth.types";



export const getAuthUser = async () => {
    try {
        const { data } = await axiosInstance.get("/auth/me")
        return data
    } catch (error: any) {
        return { user: null, authentication: false };
    }
}

export const signup = async (signupData: SignupData) => {
        const res = await axiosInstance.post("/auth/signup", signupData);
        return res.data
}

export const signin = async (signinData: SigninData) => {
    const res = await axiosInstance.post("/auth/signin", signinData);
    return res.data
}

export const signout = async () => {
    const res = await axiosInstance.post("/auth/signout");
    return res.data
}