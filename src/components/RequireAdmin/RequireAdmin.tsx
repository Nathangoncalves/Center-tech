import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import "./RequireAdmin.scss";
import { getAuthToken } from "@/services";

interface RequireAdminProps {
    children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
    const token = getAuthToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <div className="require-admin">{children}</div>;
}
