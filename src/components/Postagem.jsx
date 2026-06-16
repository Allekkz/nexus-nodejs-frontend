import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // 👈 1. IMPORTANTE: Importar o useNavigate do react-router-dom
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaChevronDown,
    FaChevronUp,
    FaTrash,
    FaPaperPlane
} from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";

export default function Postagem({ postagem, onAtualizar }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // 👈 2. IMPORTANTE: Inicializar o hook de navegação

    const [comentario, setComentario] = useState("");
    const [mostrarComentarios, setMostrarComentarios] = useState(false);

    const usuarioCurtiu = Array.isArray(postagem.curtidas) &&
        postagem.curtidas.some(curtida => Number(curtida.usuarioId) === Number(user?.id));

    async function handleCurtir() {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/postagens/${postagem.id}/curtidas`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        onAtualizar();
    }

    async function handleComentar() {
        if (!comentario.trim()) return;
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/postagens/${postagem.id}/comentarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ conteudo: comentario })
        });
        setComentario("");
        onAtualizar();
    }

    async function handleDeletarComentario(id) {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/comentarios/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        onAtualizar();
    }

    const autorValido = postagem.autor ?? {};

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-sm shadow-xl transition-all duration-200 hover:border-white/20">

            {/* HEADER DO POST */}
            {/* 👈 3. ALTERADO AQUI: Adicionado onClick na div inteira e a classe 'cursor-pointer' */}
            <div 
                onClick={() => navigate(`/perfil/${autorValido.id}`)} 
                className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity w-fit"
            >
                {/* 👈 4. ALTERADO AQUI: Removido o onClick repetido daqui e corrigido o ID para o do autor */}
                <img 
                    src={autorValido.imgUrl || "https://i.pinimg.com/originals/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg?nii=t"}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white/10"
                    alt={`Avatar de ${autorValido.nome}`}
                />

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate tracking-wide">
                        {autorValido.nome || "Estudante Nexus"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                        {new Date(postagem.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            {/* CONTEÚDO DO POST */}
            <div className="space-y-2">
                <h2 className="font-extrabold text-lg text-white tracking-tight leading-snug">
                    {postagem.titulo}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {postagem.descricao}
                </p>
            </div>

            {/* IMAGEM EM ANEXO (Se houver) */}
            {postagem.imgUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-white/5 max-h-80 bg-black/20">
                    <img
                        src={postagem.imgUrl}
                        className="w-full h-full object-cover"
                        alt="Anexo da postagem"
                    />
                </div>
            )}

            {/* BARRA DE AÇÕES (Curtidas e Comentários) */}
            <div className="flex items-center gap-6 mt-5 pt-3 border-t border-white/5 text-slate-400 text-sm font-semibold">
                <button
                    onClick={handleCurtir}
                    className={`flex items-center gap-2 transition-colors duration-150 group ${usuarioCurtiu ? 'text-red-500 hover:text-red-400' : 'hover:text-red-400'}`}
                >
                    {usuarioCurtiu ? (
                        <FaHeart className="text-base group-hover:scale-110 transition-transform text-red-500 animate-bounceOnce" />
                    ) : (
                        <FaRegHeart className="text-base group-hover:scale-110 transition-transform text-slate-400" />
                    )}
                    <span className={usuarioCurtiu ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {postagem._count?.curtidas || 0}
                    </span>
                </button>

                <button
                    onClick={() => setMostrarComentarios(!mostrarComentarios)}
                    className={`flex items-center gap-2 transition-colors duration-150 ${mostrarComentarios ? 'text-[#00df82]' : 'hover:text-[#00df82]'}`}
                >
                    <FaRegComment className="text-base" />
                    <span className="text-slate-300">{postagem._count?.comentarios || 0}</span>
                    {mostrarComentarios ? <FaChevronUp className="text-xs opacity-70" /> : <FaChevronDown className="text-xs opacity-70" />}
                </button>
            </div>

            {/* SEÇÃO EXPANSÍVEL DE COMENTÁRIOS */}
            {mostrarComentarios && (
                <div className="mt-4 border-t border-white/5 pt-4 space-y-4 animate-fadeIn">
                    <div className="flex gap-2 items-center">
                        <input
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Adicione um comentário..."
                            className="flex-1 bg-[#0f313b]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82]"
                        />
                        <button
                            onClick={handleComentar}
                            aria-label="Enviar comentário"
                            className="bg-[#00df82] hover:bg-[#00f590] active:scale-95 text-[#0f313b] p-3 rounded-xl font-bold transition-all duration-150 shadow-md shadow-[#00df82]/10"
                        >
                            <FaPaperPlane className="text-xs" />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {postagem.comentarios && postagem.comentarios.length === 0 ? (
                            <p className="text-xs text-slate-500 italic pl-1">Nenhum comentário ainda. Seja o primeiro!</p>
                        ) : (
                            postagem.comentarios?.map((c) => (
                                <div key={c.id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex justify-between items-start gap-3 transition-all hover:bg-white/10">
                                    <div className="space-y-0.5 min-w-0">
                                        {/* 👈 5. DICA EXTRA: Também adicionei navegação ao clicar no nome de quem comentou */}
                                        <p 
                                            onClick={() => navigate(`/perfil/${c.autor?.id}`)}
                                            className="text-xs font-bold text-[#00df82] tracking-wide truncate cursor-pointer hover:underline"
                                        >
                                            {c.autor?.nome || "Estudante"}
                                        </p>
                                        <p className="text-xs text-slate-200 leading-relaxed break-words">
                                            {c.conteudo}
                                        </p>
                                    </div>

                                    {user?.id === c.autor?.id && (
                                        <button
                                            onClick={() => handleDeletarComentario(c.id)}
                                            className="text-red-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-all"
                                            title="Excluir comentário"
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}