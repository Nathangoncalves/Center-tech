import { useMemo, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AdminLayout, { type AdminSection } from "@/components/AdminLayout";
import UsersSection from "./sections/UsersSection/UsersSection";
import RafflesSection from "./sections/RafflesSection/RafflesSection";
import TransactionsSection from "./sections/TransactionsSection/TransactionsSection";
import { authService } from "@/services";
import "./Admin.scss";

const BASE_SECTIONS: AdminSection[] = [
    { id: "users", label: "Usuários", icon: <GroupIcon /> },
    { id: "raffles", label: "Sorteios", icon: <ConfirmationNumberIcon /> },
    { id: "transactions", label: "Transações", icon: <ReceiptLongIcon /> },
];

export default function Admin() {
    const [activeSectionId, setActiveSectionId] = useState<string>(BASE_SECTIONS[0]!.id);

    const sections = useMemo(() => BASE_SECTIONS, []);

    const handleLogout = () => {
        authService.logout();
        window.location.href = "/";
    };

    return (
        <AdminLayout
            title="Painel do Gestor"
            subtitle="Gerencie participantes, sorteios e transações"
            sections={sections}
            activeSectionId={activeSectionId}
            onSelectSection={setActiveSectionId}
            headerActions={(
                <Tooltip title="Sair">
                    <IconButton onClick={handleLogout} color="inherit">
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            )}
        >
            <div className="admin-page">
                {activeSectionId === "users" && <UsersSection />}
                {activeSectionId === "raffles" && <RafflesSection />}
                {activeSectionId === "transactions" && <TransactionsSection />}
            </div>
        </AdminLayout>
    );
}
