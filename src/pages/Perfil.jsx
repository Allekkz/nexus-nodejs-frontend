import { useEffect, useState } from "react";
import Postagem from "../components/Postagem";
import { FaTrash, FaPen } from "react-icons/fa";

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        email: "",
        curso: "",
        bio: "",
        imgUrl: ""
    });

    async function carregarMeuPerfil() {
        try {
            const token = localStorage.getItem("token");

            const resUser = await fetch("https://nexus-nodejs-backend.onrender.com/usuarios/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = await resUser.json();

            const resPosts = await fetch(
                `https://nexus-nodejs-backend.onrender.com/postagens/usuario/${userData.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const postsData = await resPosts.json();

            setUsuario(userData);
            setPostagens(Array.isArray(postsData) ? postsData : []);

            setForm({
                nome: userData.nome || "",
                email: userData.email || "",
                curso: userData.curso || "",
                bio: userData.bio || "",
                imgUrl: userData.imgUrl || ""
            });

        } catch (err) {
            console.log(err);
            setUsuario(null);
            setPostagens([]);
        } finally {
            setLoading(false);
        }
    }

    async function salvarEdicao() {
        try {
            const token = localStorage.getItem("token");

            await fetch(`https://nexus-nodejs-backend.onrender.com/usuarios/${usuario.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            setEditando(false);
            carregarMeuPerfil();

        } catch (err) {
            console.log(err);
        }
    }

    async function deletarPost(idPost) {
        if (!confirm("Tem certeza que deseja excluir esta postagem?")) return;

        try {
            const token = localStorage.getItem("token");

            await fetch(`https://nexus-nodejs-backend.onrender.com/postagens/${idPost}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            carregarMeuPerfil();

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        carregarMeuPerfil();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col gap-3 justify-center items-center bg-[#0f313b]">
                <div className="w-10 h-10 border-4 border-[#00df82]/20 border-t-[#00df82] rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium text-sm tracking-wide">Carregando seu perfil...</p>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f313b] text-white px-4">
                <div className="text-center py-12 px-6 bg-white/5 border border-white/10 rounded-3xl max-w-sm w-full">
                    <p className="text-slate-400 font-semibold text-base">Erro ao carregar perfil</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f313b] text-white selection:bg-[#00df82] selection:text-[#0f313b] pb-32">

            {/* HEADER DO PERFIL PROPRIETÁRIO COM BANNER SUTIL */}
            <div className="relative bg-[#16424f]/40 border-b border-white/10 pb-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#00df82]/10 to-[#16424f] opacity-50 filter blur-xl"></div>
                
                <div className="max-w-xl mx-auto px-4 pt-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 justify-between">
                        
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 min-w-0 flex-1 w-full">
                            {/* Avatar customizado */}
                            <img
                                src={usuario.imgUrl || "https://i.pinimg.com/originals/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg?nii=t"}
                                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#00df82]/20 border border-white/10 shadow-xl shrink-0"
                                alt={`Sua foto de perfil`}
                            />

                            <div className="flex-1 min-w-0 space-y-1">
                                <h1 className="font-black text-2xl tracking-tight text-white truncate">
                                    {usuario.nome}
                                </h1>

                                <div className="inline-block">
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#16424f] text-[#00df82] border border-[#00df82]/10">
                                        {usuario.curso || "Curso não informado"}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-300 font-medium leading-relaxed pt-1 max-w-md italic">
                                    "{usuario.bio || "Escreva uma biografia nas configurações..."}"
                                </p>
                            </div>
                        </div>

                        {/* Botão de Editar com Visual Limpo e Ícone */}
                        <button
                            onClick={() => setEditando(true)}
                            className="mt-2 sm:mt-0 bg-white/5 hover:bg-white/10 active:scale-95 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all duration-150 shrink-0"
                        >
                            <FaPen className="text-[10px] text-[#00df82]" />
                            Editar Perfil
                        </button>
                    </div>

                    {/* Cards de Métricas Estilizados */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/5">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Minhas Publicações</p>
                            <p className="text-xl font-black text-[#00df82] mt-0.5">{postagens.length}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">E-mail Vinculado</p>
                            <p className="text-xs font-semibold text-slate-300 mt-2 truncate px-1">{usuario.email}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* SEÇÃO DO FLUXO DE POSTS DO PRÓPRIO USUÁRIO */}
            <div className="max-w-xl mx-auto p-4 space-y-4">
                <div className="pt-2 px-1">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Gerenciar Minhas Postagens
                    </h2>
                </div>

                {postagens.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white/5 border border-white/5 rounded-3xl">
                        <p className="text-slate-400 font-medium text-sm">
                            Você ainda não fez nenhuma publicação.
                        </p>
                    </div>
                ) : (
                    postagens.map((post) => (
                        <div key={post.id} className="relative group">

                            <Postagem
                                postagem={post}
                                onAtualizar={carregarMeuPerfil}
                            />

                            {/* Botão Flutuante de Deletar Post Estilizado */}
                            <button
                                onClick={() => deletarPost(post.id)}
                                aria-label="Excluir postagem"
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-400 p-2 rounded-xl bg-[#16424f]/80 backdrop-blur-md border border-white/10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                            >
                                <FaTrash size={13} />
                            </button>

                        </div>
                    ))
                )}
            </div>

            {/* MODAL EDITAR MEU PERFIL */}
            {editando && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-[#16424f] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">

                        <h2 className="text-xl font-extrabold text-white tracking-tight mb-5">
                            Editar informações básicas
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Nome Exibido
                                </label>
                                <input
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82]"
                                    placeholder="Nome completo ou apelido"
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Endereço de E-mail
                                </label>
                                <input
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82]"
                                    placeholder="seu-email@universidade.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Curso Acadêmico
                                </label>
                                <input
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82]"
                                    placeholder="Seu curso atual"
                                    value={form.curso}
                                    onChange={(e) => setForm({ ...form, curso: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    URL da Foto de Perfil
                                </label>
                                <input
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82]"
                                    placeholder="https://linkdafoto.com/imagem.jpg"
                                    value={form.imgUrl}
                                    onChange={(e) => setForm({ ...form, imgUrl: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Biografia / Status
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] resize-none"
                                    placeholder="Fale um pouco sobre você..."
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Botões de Ação do Formulário */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditando(false)}
                                className="flex-1 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white py-3 rounded-2xl font-semibold transition-all duration-200 border border-white/10"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={salvarEdicao}
                                className="flex-1 bg-[#00df82] hover:bg-[#00f590] active:scale-[0.98] text-[#0f313b] py-3 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-[#00df82]/10"
                            >
                                Salvar Alterações
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}