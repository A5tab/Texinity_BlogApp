import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
function AuthWrapper({ children }) {
    const { loading, isLoggedIn } = useSelector(state => state.auth);
    const location = useLocation();
    return (
        <>
            {loading ?
                <p>Loading...</p> : isLoggedIn ?
                    children
                    :
                    <Navigate to="/login" state={{ from: location }} replace />
            }
        </>
    )

}
export default AuthWrapper