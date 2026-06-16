import { useState, useEffect } from "react";
import { api } from "../services/api";
import Toast from "../components/Toast";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Ícone importado para o botão de voltar

export default function Register() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [curso, setCurso] = useState("");

    const [toast, setToast] = useState("");
    const [toastTipo, setToastTipo] = useState("erro");

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast]);

    const [aceitouTermos, setAceitouTermos] = useState(false);
    const [mostrarTermos, setMostrarTermos] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!curso) {
            setToastTipo("erro");
            setToast("Por favor, selecione um curso.");
            return;
        }

        try {
            const response = await api.post("/usuarios/register", {
                nome,
                email,
                senha,
                curso
            });

            console.log(response.data);

            setToastTipo("sucesso");
            setToast("Conta criada com sucesso.");

            setTimeout(() => {
                navigate("/");
            }, 1500);

            setNome("");
            setEmail("");
            setSenha("");
            setCurso("");
            setAceitouTermos(false);

        } catch (error) {
            console.error(error);

            setToastTipo("erro");
            setToast(
                error?.response?.data?.erro ||
                "Erro ao criar conta. " + error.message
            );
        }
    }

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-tr from-[#0f313b] via-[#16424f] to-[#0f313b] selection:bg-[#00df82] selection:text-[#0f313b] relative">
                
                {/* 🌟 BOTÃO VOLTAR FLUTUANTE (Topo Esquerdo) */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-[#00df82] bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl transition-all duration-200 text-sm font-semibold shadow-lg backdrop-blur-md active:scale-95 group"
                >
                    <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar para o Login</span>
                </button>

                {/* Container Principal */}
                <div className="w-full max-w-md sm:bg-white/5 sm:backdrop-blur-xl sm:border sm:border-white/10 sm:p-10 p-4 rounded-3xl sm:shadow-2xl transition-all duration-300 mt-12 sm:mt-0">
                    
                    {/* Header do App */}
                    <div className="text-center mb-8">
                        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00df82] to-[#16424f] items-center justify-center shadow-lg shadow-[#00df82]/20 mb-4">
                            <span className="text-white font-black text-xl tracking-tighter">N</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            Nexus
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
                            Conecte-se com estudantes da sua universidade
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Campo Nome */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome completo"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                            />
                        </div>

                        {/* Campo E-mail */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@universidade.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                            />
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Crie uma senha forte"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                            />
                        </div>

                        {/* Campo Curso */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Curso
                            </label>
                            <div className="relative">
                                <select
                                    value={curso}
                                    onChange={(e) => setCurso(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#0f313b] text-slate-400">Selecione um curso</option>
                                    <option value="Ciência da Computação" className="bg-[#0f313b] text-white">Ciência da Computação</option>
                                    <option value="Administração" className="bg-[#0f313b] text-white">Administração</option>
                                    <option value="Direito" className="bg-[#0f313b] text-white">Direito</option>
                                    <option value="Pedagogia" className="bg-[#0f313b] text-white">Pedagogia</option>
                                    <option value="Psicologia" className="bg-[#0f313b] text-white">Psicologia</option>
                                    <option value="Nutrição" className="bg-[#0f313b] text-white">Nutrição</option>
                                    <option value="Estética e Cosmética" className="bg-[#0f313b] text-white">Estética e Cosmética</option>
                                    <option value="Enfermagem" className="bg-[#0f313b] text-white">Enfermagem</option>
                                    <option value="Ciências contábeis" className="bg-[#0f313b] text-white">Ciências contábeis</option>
                                    <option value="Educação Física" className="bg-[#0f313b] text-white">Educação Física</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox de Termos de Uso */}
                        <div className="pt-2">
                            <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    checked={aceitouTermos}
                                    onChange={(e) => setAceitouTermos(e.target.checked)}
                                    className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-[#00df82] focus:ring-0 focus:ring-offset-0 accent-[#00df82] cursor-pointer transition-all duration-200"
                                />
                                <span className="font-medium">
                                    Li e aceito os{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMostrarTermos(true)}
                                        className="font-bold text-[#00df82] hover:underline transition-all underline-offset-4 ml-0.5"
                                    >
                                        Termos de Uso
                                    </button>
                                </span>
                            </label>
                        </div>

                        {/* Botão de Envio */}
                        <button
                            type="submit"
                            disabled={!aceitouTermos}
                            className={`w-full py-4 rounded-2xl font-bold tracking-wide transition-all duration-200 shadow-lg mt-6 active:scale-[0.98] ${
                                !aceitouTermos
                                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed shadow-none"
                                    : "bg-[#00df82] text-[#0f313b] hover:bg-[#00f590] shadow-[#00df82]/10"
                            }`}
                        >
                            Criar Minha Conta
                        </button>

                        {/* 🌟 CORRIGIDO AQUI: Alterado o to="/login" para to="/" refletindo seu AppRoutes */}
                        <p className="text-center mt-6 text-sm text-slate-400 font-medium">
                            Já tem uma conta?{" "}
                            <Link
                                to="/"
                                className="font-bold text-[#00df82] hover:underline transition-all underline-offset-4"
                            >
                                Fazer Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Modal de Termos de Uso Customizado */}
            {mostrarTermos && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn">
                    <div className="bg-[#16424f] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl">
                        
                        <h2 className="text-2xl font-extrabold mb-4 text-white tracking-tight">
                            Termos de Uso
                        </h2> 

                        <div className="text-slate-300 space-y-4 max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed scrollbar-thin">
                            <p className="font-medium text-slate-200">
                                Ao utilizar a rede social Nexus, você concorda em seguir as nossas diretrizes comunitárias:
                            </p>
                            <ul className="list-disc pl-5 space-y-3 text-slate-300">
                                <li>Utilizar a rede social de forma estritamente respeitosa com colegas e professores.</li>
                                <li>Não publicar ou compartilhar conteúdo ofensivo, violento, preconceituoso ou ilegal.</li>
                                <li>Assumir total responsabilidade civil pelas informações e mídias publicadas em seu perfil.</li>
                                <li>Respeitar a privacidade e propriedade intelectual dos demais integrantes da plataforma.</li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={() => setMostrarTermos(false)}
                            className="mt-6 w-full bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white py-3.5 rounded-2xl font-semibold tracking-wide transition-all duration-200 border border-white/10"
                        >
                            Entendi e Fechar
                        </button>
                    </div>
                </div>
            )}

            <Toast
                mensagem={toast}
                tipo={toastTipo}
                onClose={() => setToast("")}
            />
        </>
    );
}