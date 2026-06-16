import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Postagem from "../components/Postagem";

export default function PerfilUsuario() {
    const { id } = useParams();

    const [usuario, setUsuario] = useState(null);
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregarPerfil() {
        try {
            const token = localStorage.getItem("token");

            // usuário
            const resUser = await fetch(`https://nexus-nodejs-backend.onrender.com/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = await resUser.json();

            // postagens do usuário
            const resPosts = await fetch(
                `https://nexus-nodejs-backend.onrender.com/postagens/usuario/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const postsData = await resPosts.json();

            setUsuario(userData);
            setPostagens(Array.isArray(postsData) ? postsData : []);

        } catch (err) {
            console.log("Erro perfil:", err);
            setUsuario(null);
            setPostagens([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarPerfil();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col gap-3 justify-center items-center bg-[#0f313b]">
                <div className="w-10 h-10 border-4 border-[#00df82]/20 border-t-[#00df82] rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium text-sm tracking-wide">Carregando perfil...</p>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f313b] text-white px-4">
                <div className="text-center py-12 px-6 bg-white/5 border border-white/10 rounded-3xl max-w-sm w-full">
                    <p className="text-slate-400 font-semibold text-base">Usuário não encontrado</p>
                    <p className="text-xs text-slate-500 mt-1">O link pode estar quebrado ou a conta foi removida.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f313b] text-white selection:bg-[#00df82] selection:text-[#0f313b] pb-32">

            {/* HEADER DO PERFIL ESTILO BANNER */}
            <div className="relative bg-[#16424f]/40 border-b border-white/10 pb-6 overflow-hidden">
                {/* Detalhe estético de fundo simulando um degradê de capa */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#00df82]/10 to-[#16424f] opacity-50 filter blur-xl"></div>
                
                <div className="max-w-xl mx-auto px-4 pt-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                        
                        {/* Imagem de Perfil Premium */}
                        <img
                            src={usuario.imgUrl || "https://i.pinimg.com/originals/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg?nii=t"}
                            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#00df82]/20 border border-white/10 shadow-xl"
                            alt={`Foto de ${usuario.nome}`}
                        />

                        {/* Dados textuais do usuário */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <h1 className="font-black text-2xl tracking-tight text-white truncate">
                                {usuario.nome}
                            </h1>

                            {/* Tag do Curso */}
                            <div className="inline-block">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#16424f] text-[#00df82] border border-[#00df82]/10">
                                    {usuario.curso || "Estudante"}
                                </span>
                            </div>

                            {/* Biografia formatada */}
                            <p className="text-sm text-slate-300 font-medium leading-relaxed pt-1 max-w-md italic">
                                "{usuario.bio || "Sem biografia ainda."}"
                            </p>
                        </div>
                    </div>

                    {/* Cards de Métricas / Estatísticas */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/5">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Postagens</p>
                            <p className="text-xl font-black text-[#00df82] mt-0.5">{usuario._count?.postagens ?? 0}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Comentários</p>
                            <p className="text-xl font-black text-[#00df82] mt-0.5">{usuario._count?.comentarios ?? 0}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* SEÇÃO DO FLUXO DE POSTS DO USUÁRIO */}
            <div className="max-w-xl mx-auto p-4 space-y-4">
                
                {/* Divisória visual informando o que são os posts abaixo */}
                <div className="pt-2 px-1">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Publicações de {usuario.nome?.split(" ")[0]}
                    </h2>
                </div>

                {postagens.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white/5 border border-white/5 rounded-3xl">
                        <p className="text-slate-400 font-medium text-sm">
                            Este usuário ainda não fez nenhuma publicação.
                        </p>
                    </div>
                ) : (
                    postagens.map((post) => (
                        <Postagem
                            key={post.id}
                            postagem={post}
                            onAtualizar={carregarPerfil}
                        />
                    ))
                )}
            </div>

        </div>
    );
}