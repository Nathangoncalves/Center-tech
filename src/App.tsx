import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
import RequireAdmin from "./components/RequireAdmin";
import Participant from "./pages/participant/Participant";
=======

import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import ParticipantDashboard from "@/pages/Participant";
import RequireAdmin from "@/components/RequireAdmin";

>>>>>>> main

export default function App() {
    return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
        <Route path="/participante" element={<Participant />} />
=======
        <Route path="/participante" element={<ParticipantDashboard />} />
>>>>>>> main
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
