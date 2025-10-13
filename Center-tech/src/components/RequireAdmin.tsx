import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
    const { authed } = useAuth();
    const loc = useLocation();
    if (!authed) return <Navigate to="/login" state={{ from: loc }} replace />;
    return children;
}