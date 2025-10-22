import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
import RequireAdmin from "./components/RequireAdmin";

export default function App() {
    return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
