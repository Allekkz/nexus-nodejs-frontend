import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [toast, setToast] = useState("");
    const [toastTipo, setToastTipo] = useState("erro");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await api.post("/usuarios/login", {
                email,
                senha
            });

            login(response.data.user, response.data.token);

            setToastTipo("sucesso");
            setToast("Login realizado com sucesso");

            setTimeout(() => {
                navigate("/feed");
            }, 800);

        } catch (err) {
            setToastTipo("erro");
            setToast(
                err?.response?.data?.erro || "Erro ao realizar login"
            );
        }
    }

    useEffect(() => {
        if (!toast) return;

        const t = setTimeout(() => setToast(""), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-tr from-[#0f313b] via-[#16424f] to-[#0f313b] selection:bg-[#00df82] selection:text-[#0f313b]">
                
                {/* Container Principal que se adapta elegantemente ao Desktop e Mobile */}
                <div className="w-full max-w-md sm:bg-white/5 sm:backdrop-blur-xl sm:border sm:border-white/10 sm:p-10 p-4 rounded-3xl sm:shadow-2xl transition-all duration-300">
                    
                    {/* Header do App */}
                    <div className="flex flex-col items-center mb-8">
                        {/* Detalhe estético simulando a logo ou conexão da Nexus */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00df82] to-[#16424f] flex items-center justify-center shadow-lg shadow-[#00df82]/20 mb-4">
                            <span className="text-white font-black text-xl tracking-tighter">N</span>
                        </div>
                        
                        <h1 className="text-4xl font-extrabold text-center text-white tracking-tight">
                            Nexus
                        </h1>
                        <p className="text-center text-slate-400 mt-2 text-sm font-medium tracking-wide">
                            Conecte-se ao seu mundo.
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                E-mail
                            </label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                                placeholder="exemplo@nexus.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Senha
                                </label>
                            </div>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-[#00df82] focus:ring-4 focus:ring-[#00df82]/10"
                                placeholder="Sua senha secreta"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>

                        {/* Botão Entrar com efeito de escala e hover sutil */}
                        <button
                            type="submit"
                            className="w-full bg-[#00df82] hover:bg-[#00f590] active:scale-[0.98] text-[#0f313b] py-4 rounded-2xl font-bold tracking-wide transition-all duration-200 shadow-lg shadow-[#00df82]/20 mt-6"
                        >
                            Entrar na Conta
                        </button>

                        {/* Link de Cadastro remodelado */}
                        <p className="text-center mt-6 text-sm text-slate-400 font-medium">
                            Não tem uma conta?{" "}
                            <Link
                                to="/register"
                                className="font-bold text-[#00df82] hover:underline transition-all underline-offset-4"
                            >
                                Criar conta gratuita
                            </Link>
                        </p>
                    </form>
                </div>

            </div>

            <Toast
                mensagem={toast}
                tipo={toastTipo}
                onClose={() => setToast("")}
            />
        </>
    );
}