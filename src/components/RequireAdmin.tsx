import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { getAuthToken } from "../services/api";

interface RequireAdminProps {
    children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
    const token = getAuthToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}
