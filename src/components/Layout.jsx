import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#0f313b] text-white selection:bg-[#00df82] selection:text-[#0f313b]">

            {/* CONTEÚDO PRINCIPAL DO FILHO (FEED, PERFIL, ETC) */}
            <div className="w-full">
                <Outlet />
            </div>

            {/* MENU INFERIOR FLUTUANTE PREMIUM */}
            <nav className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto bg-[#16424f]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-2 shadow-2xl shadow-black/40">
                <div className="flex justify-around items-center">

                    {/* BOTÃO FEED */}
                    <button
                        onClick={() => navigate("/feed")}
                        className={`flex flex-col items-center gap-1 text-xs font-bold tracking-wide py-1.5 px-4 rounded-xl transition-all duration-200 ${
                            isActive("/feed") 
                                ? "text-[#0f313b] bg-[#00df82] shadow-md shadow-[#00df82]/20 scale-105" 
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <FaHome size={18} />
                        <span>Feed</span>
                    </button>

                    {/* BOTÃO USUÁRIOS */}
                    <button
                        onClick={() => navigate("/usuarios")}
                        className={`flex flex-col items-center gap-1 text-xs font-bold tracking-wide py-1.5 px-4 rounded-xl transition-all duration-200 ${
                            isActive("/usuarios") 
                                ? "text-[#0f313b] bg-[#00df82] shadow-md shadow-[#00df82]/20 scale-105" 
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <FaUsers size={18} />
                        <span>Usuários</span>
                    </button>

                    {/* BOTÃO PERFIL */}
                    <button
                        onClick={() => navigate("/perfil")}
                        className={`flex flex-col items-center gap-1 text-xs font-bold tracking-wide py-1.5 px-4 rounded-xl transition-all duration-200 ${
                            isActive("/perfil") 
                                ? "text-[#0f313b] bg-[#00df82] shadow-md shadow-[#00df82]/20 scale-105" 
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <FaUser size={18} />
                        <span>Perfil</span>
                    </button>

                </div>
            </nav>

        </div>
    );
}