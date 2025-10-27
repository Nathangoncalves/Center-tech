import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
import RequireAdmin from "./components/RequireAdmin";
import Participant from "./pages/participant/Participant";
import RequireAuth from "./components/RequireAuth";

export default function App() {
    return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/participante"
                    element={(
                        <RequireAuth>
                            <Participant />
                        </RequireAuth>
                    )}
                />
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
