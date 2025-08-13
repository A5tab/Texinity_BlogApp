import { axiosPrivate } from "./axios.js";
import { store } from "../store/store.js"
import { refreshAccessToken, logout } from "../features/auth/thunks.js";

export const setUpAxiosInterceptors = (navigate) => {
    axiosPrivate.interceptors.request.use(
        (config) => {
            if (!config.headers['Authorization']) {
                const { auth } = store.getState();
                config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    )

    axiosPrivate.interceptors.response.use(
        (response) => response,
        async (error) => {
            console.log(prevRequest);
            const prevRequest = error?.config;
            if (error?.response?.status === 401 && !prevRequest?.sent) {
                prevRequest.sent = true;
                // try {
                // const resultAction = await store.dispatch(refreshAccessToken()).unwrap();
                // const newAccessToken = resultAction?.accessToken ?? resultAction;
                store.dispatch(refreshAccessToken())
                const newAccessToken = store.getState().auth.accessToken
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosPrivate(prevRequest);
                // } catch (refTokenError) {
                //     console.log("req cauing error ", prevRequest);
                //     console.log(refTokenError);
                //     store.dispatch(logout());
                //     navigate("/login");
                // }
            }
            return Promise.reject(error);
        }
    )
}

