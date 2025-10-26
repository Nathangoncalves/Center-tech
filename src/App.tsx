import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import ParticipantDashboard from "@/pages/Participant";
import RequireAdmin from "@/components/RequireAdmin";


export default function App() {
    return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/participante" element={<ParticipantDashboard />} />
        <Route
            path="/gestor"
            element={(
                <RequireAdmin>
                <Admin />
                </RequireAdmin>
            )}
        />
        </Routes>
    </BrowserRouter>
    );
}
