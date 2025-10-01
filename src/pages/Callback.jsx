import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Callback = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        // Tunggu Auth0 menyelesaikan proses autentikasi
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Navigate to="/dashboard" replace />;
};

export default Callback;
