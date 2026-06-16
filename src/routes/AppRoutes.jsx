import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

import Feed from "../pages/Feed";
import Usuarios from "../pages/Usuarios";
import Perfil from "../pages/Perfil";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PerfilUsuario from "../pages/PerfilUsuario";

export default function AppRoutes() {
    return (
        <Routes>

            {/* públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protegidas */}
            <Route element={<Layout />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/:id" element={<PerfilUsuario />} />
            </Route>

        </Routes>
    );
}