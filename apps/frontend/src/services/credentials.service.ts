import { axiosInstance } from "../lib/axios";
import type { CredentialData, UpdateCredentialData } from "../types/credential.types";


export const postCredentials = async (credentialData: CredentialData) => {
    const res = await axiosInstance.post("/credentials/postCredentials", credentialData);
    return res.data
}

export const getCredentials = async () => {
    const res = await axiosInstance.get("/credentials/getCredentials");
    return res.data
}

export const getCredentialById = async (id: string) => {
    const res = await axiosInstance.get(`/credentials/getCredentialById/${id}`)
    return res.data
}

export const updateCredentials = async (id:string, updateCredentialData: UpdateCredentialData) => {
    const res = await axiosInstance.put(`/credentials/updateCredentials/${id}`, {updateCredentialData})
    return res.data
}

export const deleteCredentials = async (id: string) => {
    const res = await axiosInstance.delete(`/credentials/deleteCredentials/${id}`)
    return res.data
}