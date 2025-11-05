import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
import RequireAdmin from "./components/RequireAdmin";
import Participant from "./pages/participant/Participant";
import RequireAuth from "./components/RequireAuth";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancelled from "./pages/payment/PaymentCancelled";
import PaymentReturn from "./pages/payment/PaymentReturn";
import Sorteios from "./pages/Public/Sorteios";
import Winners from "./pages/Public/Winners";
import Regulation from "./pages/Public/Regulation";
import HowItWorks from "./pages/Public/HowItWorks";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sorteios" element={<Sorteios />} />
                <Route path="/ganhadores" element={<Winners />} />
                <Route path="/regulamento" element={<Regulation />} />
                <Route path="/como-funciona" element={<HowItWorks />} />
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
                <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
                <Route path="/pagamento/cancelado" element={<PaymentCancelled />} />
                <Route path="/pagamento/retorno" element={<PaymentReturn />} />
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
