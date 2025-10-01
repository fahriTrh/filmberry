import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import Header from "../../components/Header";

const Dashboard = () => {

    const { isAuthenticated, user } = useAuth0();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Header />
            <div className="
                w-[90%]
                lg:w-[85%]
                mx-auto
                mt-10">
                    
                <img className="mt-40 rounded-full" width={100} src={user.picture} />
                <h1 className="mt-3">Welcome <span className="text-primary">{user.name}</span></h1>
            </div>
        </div>
    )

}

export default Dashboard