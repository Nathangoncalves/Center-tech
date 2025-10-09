import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";

export default function App() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/cadastro" element={<Signup />}/>
            <Route path="/gestor" element={<Admin />}/>
        </Routes>
    </BrowserRouter>
    );
}