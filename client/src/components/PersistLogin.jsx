import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { refreshAccessToken } from '../features/auth/thunks.js'

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            // if (!auth?.accessToken) {
            try {
                dispatch(refreshAccessToken())
            } catch (err) {
                console.error("Refresh token failed:", err);
            }
            finally {
                setIsLoading(false);
            }
            // }
            // setIsLoading(false);
        };
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    // useEffect(() => {
    // console.log("isLoading of persist login", isLoading);
    // console.log("auth", auth);
    // }, [isLoading, auth])
    return isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;
