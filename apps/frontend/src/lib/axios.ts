import axios from "axios"


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized - user may need to log in.")
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;