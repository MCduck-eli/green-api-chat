import { useState } from "react";
import { useAuthStore } from "../context/auth-store";

const Login = () => {
    const [id, setId] = useState("");
    const [token, setToken] = useState("");
    const login = useAuthStore((state) => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id.trim() && token.trim()) {
            login(id, token);
        }
    };

    return (
        <div className="min-h-screen bg-chat-pattern flex items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="relative bg-[#1c1c1e]/90 backdrop-blur-md w-full max-w-md p-10 rounded-[2rem] shadow-2xl border border-gray-800/50 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/30 via-indigo-900/10 to-transparent blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8 text-gray-400">
                        <button className="hover:text-white transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                            </svg>
                        </button>
                        <button className="hover:text-white transition-colors">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex justify-center items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            <div className="w-3 h-3 bg-[#1c1c1e] rounded-full"></div>
                        </div>
                        <h1 className="text-white text-3xl font-bold tracking-wide">
                            MAX
                        </h1>
                    </div>

                    <h2 className="text-white text-center text-lg font-medium mb-8">
                        С какими данными
                        <br />
                        хотите войти?
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="idInstance"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full bg-[#2c2c2e]/80 text-white px-5 py-3.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500 border border-transparent focus:border-blue-500/50"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="apiTokenInstance"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full bg-[#2c2c2e]/80 text-white px-5 py-3.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500 border border-transparent focus:border-blue-500/50"
                                required
                            />
                        </div>

                        <p className="text-[#6c6c70] text-[11px] text-center mt-6 mb-6 leading-relaxed px-4">
                            Для входа нужны данные из консоли GREEN-API —
                            скопируйте их, чтобы продолжить
                        </p>

                        <button
                            type="submit"
                            className="w-full bg-[#007aff] hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all active:scale-[0.98]"
                        >
                            Продолжить
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[#6c6c70] text-[10px] leading-relaxed mb-3">
                            Нажимая «Продолжить», вы принимаете политику
                            <br />
                            конфиденциальности, пользовательское
                            <br />
                            соглашение и правила персональных
                            <br />
                            рекомендаций
                        </p>
                        <button className="text-[#007aff] text-sm hover:underline">
                            Войти по QR-коду
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
