import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Handshake, Lock, Mail, AlertCircle } from "lucide-react";
import { AuthService } from "../services/AuthService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor, preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await AuthService.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setForgotSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#1e3a5f] via-[#1a4a8a] to-[#2563eb] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute top-1/3 -left-10 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Handshake size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-tight">ConveFlow</p>
            <p className="text-blue-300 text-xs leading-tight">Sistema de Gestão de Convênios</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h2 className="text-white/90 mb-6" style={{ fontSize: "2rem", lineHeight: 1.3, fontWeight: 600 }}>
            Gerencie convênios com eficiência e controle total
          </h2>
          <div className="space-y-4">
            {[
              "Centralização de empresas conveniadas",
              "Controle de vigência e renovações",
              "Repositório de documentos organizado",
              "Alertas automáticos de vencimento",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-300" />
                </div>
                <p className="text-blue-100 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-blue-300 text-xs">
            Setor TEIA e Núcleo de Carreiras · © 2025 ConveFlow
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Handshake size={22} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">ConveFlow</p>
              <p className="text-gray-500 text-xs leading-tight">Gestão de Convênios</p>
            </div>
          </div>

          {!forgot ? (
            <>
              <div className="mb-8">
                <h2 className="text-gray-900 mb-1">Bem-vindo de volta</h2>
                <p className="text-gray-500 text-sm">Entre com suas credenciais institucionais</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">E-mail institucional</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@instituicao.edu.br"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Senha</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600" />
                    <span className="text-sm text-gray-600">Lembrar-me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgot(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Esqueci a senha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar no sistema"
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Não tem conta? Cadastre-se
                </button>
              </div>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  <span className="font-medium text-gray-600">Acesso restrito</span> · Use suas credenciais institucionais
                </p>
              </div>
            </>
          ) : !forgotSent ? (
            <>
              <button
                onClick={() => setForgot(false)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
              >
                ← Voltar ao login
              </button>
              <div className="mb-8">
                <h2 className="text-gray-900 mb-1">Recuperar senha</h2>
                <p className="text-gray-500 text-sm">
                  Informe seu e-mail institucional e enviaremos as instruções
                </p>
              </div>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">E-mail institucional</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="seu@instituicao.edu.br"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar instruções"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-gray-900 mb-2">E-mail enviado!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <button
                  onClick={() => { setForgot(false); setForgotSent(false); }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Voltar ao login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
