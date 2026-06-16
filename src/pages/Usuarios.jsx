import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    async function carregarUsuarios() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("https://nexus-nodejs-backend.onrender.com/usuarios", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col gap-3 justify-center items-center bg-[#0f313b]">
                <div className="w-10 h-10 border-4 border-[#00df82]/20 border-t-[#00df82] rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium text-sm tracking-wide">Buscando estudantes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f313b] text-white selection:bg-[#00df82] selection:text-[#0f313b] pb-32">

            {/* HEADER FIXO DO TOPO COM DESFOCADO */}
            <header className="sticky top-0 z-40 bg-[#0f313b]/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00df82] to-[#16424f] flex items-center justify-center shadow-md shadow-[#00df82]/10">
                            <span className="text-white font-black text-sm tracking-tighter">N</span>
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Comunidade
                        </h1>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#16424f] text-[#00df82] border border-[#00df82]/20">
                        {usuarios.length} integrados
                    </span>
                </div>
            </header>

            {/* FLUXO DA LISTAGEM DE USUÁRIOS */}
            <div className="max-w-xl mx-auto px-4 mt-6 space-y-3">

                {usuarios.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
                        <p className="text-slate-400 font-medium text-sm">
                            Nenhum colega encontrado por aqui.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Convide pessoas do seu curso para fazerem parte da Nexus!
                        </p>
                    </div>
                ) : (
                    usuarios.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07]"
                        >
                            {/* Bloco do Perfil (Avatar + Info) */}
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    src={user.imgUrl || "https://i.pinimg.com/originals/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg?nii=t"}
                                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5 border border-white/10 shrink-0"
                                    alt={`Foto de ${user.nome}`}
                                />

                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-white text-sm truncate tracking-wide">
                                        {user.nome}
                                    </span>
                                    {/* CORREÇÃO AQUI: Mostra o curso dinâmico do banco de dados */}
                                    <span className="text-xs text-[#00df82] font-semibold mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                                        {user.curso}
                                    </span>
                                </div>
                            </div>

                            {/* Botão de Ação Premium */}
                            <button
                                onClick={() => navigate(`/perfil/${user.id}`)}
                                className="text-xs font-bold text-[#0f313b] bg-[#00df82] hover:bg-[#00f590] active:scale-95 px-4 py-2 rounded-xl transition-all duration-150 shadow-md shadow-[#00df82]/10 shrink-0"
                            >
                                Perfil
                            </button>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}