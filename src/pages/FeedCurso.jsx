import { useEffect, useState } from "react";
import Postagem from "../components/Postagem";

export default function FeedCurso() {
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [curso, setCurso] = useState("");

    const cursos = [
        "Ciência da Computação",
        "Administração",
        "Direito",
        "Pedagogia",
        "Psicologia",
        "Nutrição",
        "Estética e Cosmética",
        "Enfermagem",
        "Ciências contábeis",
        "Educação Física"
    ];

    async function carregarPostagensPorCurso(cursoSelecionado) {
        if (!cursoSelecionado) {
            setPostagens([]);
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://nexus-nodejs-backend.onrender.com/postagens/curso/${encodeURIComponent(cursoSelecionado)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            setPostagens(Array.isArray(data) ? data : []);

        } catch (err) {
            console.log(err);
            setPostagens([]);
        } finally {
            setLoading(false);
        }
    }

    function handleCursoChange(e) {
        const novoCurso = e.target.value;

        setCurso(novoCurso);
        carregarPostagensPorCurso(novoCurso);
    }

    return (
        <div className="min-h-screen bg-[#0f313b] text-white selection:bg-[#00df82] selection:text-[#0f313b] pb-32">

            {/* CABEÇALHO */}
            <header className="sticky top-0 z-40 bg-[#0f313b]/85 backdrop-blur-md border-b border-white/5 px-4 py-4 shadow-lg shadow-black/10">

                <div className="max-w-xl mx-auto px-1">

                    <div className="flex items-center justify-between mb-4">

                        <h1 className="text-2xl font-black tracking-tight text-white">
                            Feed por curso
                        </h1>

                        {curso && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#16424f] text-[#00df82] border border-[#00df82]/20">
                                {postagens.length} {postagens.length === 1 ? "post" : "posts"}
                            </span>
                        )}

                    </div>

                    {/* SELETOR DE CURSO */}
                    <select
                        value={curso}
                        onChange={handleCursoChange}
                        className="w-full bg-[#16424f] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10 transition-all"
                    >
                        <option value="">
                            Selecione um curso
                        </option>

                        {cursos.map((cursoItem) => (
                            <option key={cursoItem} value={cursoItem}>
                                {cursoItem}
                            </option>
                        ))}
                    </select>

                </div>

            </header>

            {/* POSTS */}
            <main className="max-w-xl mx-auto px-4 mt-4 space-y-4">

                {!curso ? (

                    <div className="text-center py-16 px-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">

                        <p className="text-slate-300 font-medium text-sm">
                            Selecione um curso para começar.
                        </p>

                        <p className="text-xs text-slate-500 mt-2">
                            Você verá as postagens dos estudantes desse curso.
                        </p>

                    </div>

                ) : loading ? (

                    <div className="flex flex-col gap-3 justify-center items-center py-16">

                        <div className="w-10 h-10 border-4 border-[#00df82]/20 border-t-[#00df82] rounded-full animate-spin"></div>

                        <p className="text-slate-400 font-medium text-sm tracking-wide">
                            Carregando postagens...
                        </p>

                    </div>

                ) : postagens.length === 0 ? (

                    <div className="text-center py-16 px-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">

                        <p className="text-slate-400 font-medium text-sm">
                            Nenhuma postagem encontrada.
                        </p>

                        <p className="text-xs text-slate-500 mt-2">
                            Ainda não existem postagens nesse curso.
                        </p>

                    </div>

                ) : (

                    postagens.map((post) => (
                        <Postagem
                            key={post.id}
                            postagem={post}
                            onAtualizar={() => carregarPostagensPorCurso(curso)}
                        />
                    ))

                )}

            </main>

        </div>
    );
}

