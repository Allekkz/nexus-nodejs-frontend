import { useEffect, useState } from "react";
import Postagem from "../components/Postagem";
import { FaPlus } from "react-icons/fa";

export default function Feed() {
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);

    const [abrirModal, setAbrirModal] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        imgUrl: ""
    });

    async function carregarPostagens() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("https://nexus-nodejs-backend.onrender.com/postagens", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            setPostagens(Array.isArray(data) ? data : []);

        } catch (err) {
            console.log(err);
            setPostagens([]);
        } finally {
            setLoading(false);
        }
    }

    async function criarPost() {
        if (enviando) return;

        try {
            setEnviando(true);

            const token = localStorage.getItem("token");

            await fetch("https://nexus-nodejs-backend.onrender.com/postagens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            setForm({
                titulo: "",
                descricao: "",
                imgUrl: ""
            });

            setAbrirModal(false);
            carregarPostagens();

        } catch (err) {
            console.log(err);
        } finally {
            setEnviando(false);
        }
    }

    useEffect(() => {
        carregarPostagens();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center h-screen bg-[#0f313b]">
                <div className="w-10 h-10 border-4 border-[#00df82]/20 border-t-[#00df82] rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium text-sm tracking-wide">Carregando feed...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f313b] text-white selection:bg-[#00df82] selection:text-[#0f313b] pb-32">
            
            {/* CABEÇALHO FIXO COM EFEITO TRANSLÚCIDO (GLASSMORPHISM) */}
            <header className="sticky top-0 z-40 bg-[#0f313b]/85 backdrop-blur-md border-b border-white/5 px-4 py-4 shadow-lg shadow-black/10">
                <div className="max-w-xl mx-auto flex items-center justify-between px-1">
                    <h1 className="text-2xl font-black tracking-tight text-white">
                        Feed Geral
                    </h1>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#16424f] text-[#00df82] border border-[#00df82]/20 shadow-inner">
                        {postagens.length} {postagens.length === 1 ? 'post' : 'posts'}
                    </span>
                </div>
            </header>

            {/* CONTAINER CENTRALIZADO DO FLUXO DE POSTS */}
            <main className="max-w-xl mx-auto px-4 mt-4 space-y-4">
                {postagens.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
                        <p className="text-slate-400 font-medium text-sm">
                            Nenhuma postagem ainda por aqui.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Seja o primeiro a compartilhar algo com a universidade!
                        </p>
                    </div>
                ) : (
                    postagens.map((post) => (
                        <Postagem
                            key={post.id}
                            postagem={post}
                            onAtualizar={carregarPostagens}
                        />
                    ))
                )}
            </main>

            {/* BOTÃO FLUTUANTE DE CRIAR POST */}
            <button
                onClick={() => setAbrirModal(true)}
                aria-label="Criar nova postagem"
                className="fixed bottom-24 right-6 bg-[#00df82] hover:bg-[#00f590] active:scale-95 text-[#0f313b] p-4 rounded-2xl shadow-xl shadow-[#00df82]/20 transition-all duration-200 z-40 group"
            >
                <FaPlus className="text-lg transition-transform duration-200 group-hover:rotate-90" />
            </button>

            {/* MODAL DE CRIAÇÃO DE POSTAGEM */}
            {abrirModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-[#16424f] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl">

                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-extrabold text-white tracking-tight">
                                Criar nova postagem
                            </h2>
                            <span className="w-2 h-2 rounded-full bg-[#00df82] animate-pulse"></span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Título do Post
                                </label>
                                <input
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                                    placeholder="Um título direto e claro..."
                                    value={form.titulo}
                                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Descrição / Conteúdo
                                </label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10 resize-none"
                                    placeholder="O que quer compartilhar com os estudantes?"
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Link da Imagem
                                </label>
                                <input
                                    className="w-full bg-[#0f313b]/60 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                                    placeholder="https://exemplo.com/imagem.jpg (opcional)"
                                    value={form.imgUrl}
                                    onChange={(e) => setForm({ ...form, imgUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setAbrirModal(false)}
                                className="flex-1 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white py-3 rounded-2xl font-semibold transition-all duration-200 border border-white/10"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={criarPost}
                                disabled={enviando || !form.titulo.trim() || !form.descricao.trim()}
                                className="flex-1 bg-[#00df82] hover:bg-[#00f590] active:scale-[0.98] text-[#0f313b] py-3 rounded-2xl font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00df82]/10"
                            >
                                {enviando ? "Publicando..." : "Publicar"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}