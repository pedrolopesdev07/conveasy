import { Database, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseConfig.js";
import { useState, useEffect } from "react";

export default function TestSupabase() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [testResult, setTestResult] = useState<string>("");

  // Testa a conexão assim que o componente carrega
  const testConnection = async () => {
    try {
      // Tenta buscar 1 registro da tabela "testes" (se existir)
      const { data, error } = await supabase
        .from('testes')
        .select('*')
        .limit(1);
      if (error) throw error;
      setIsConnected(true);
    } catch (err: any) {
      console.error(err);
      setIsConnected(false);
      setTestResult(`Erro de conexão: ${err.message}`);
    }
  };

  // Função para gravar um documento de teste
  const gravarTeste = async () => {
    try {
      const { data, error } = await supabase
        .from('testes')
        .insert([
          { mensagem: "Mensagem enviada!", data: new Date().toISOString() }
        ])
        .select(); // retorna o registro inserido
      if (error) throw error;
      alert("Dados gravados no Supabase com sucesso!");
      setTestResult(`Último registro: ${JSON.stringify(data)}`);
    } catch (e: any) {
      console.error(e);
      alert("Erro ao gravar: " + e.message);
      setTestResult(`Erro: ${e.message}`);
    }
  };

  // Chama o teste de conexão quando o componente monta
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-sky-700 via-cyan-600 to-emerald-500 px-8 py-10 text-white">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Database size={28} />
            </div>
            <h1 className="text-3xl font-semibold">Teste de conexão com Supabase</h1>
            <p className="mt-2 max-w-2xl text-sm text-cyan-50">
              Esta página confirma que a configuração do Supabase está funcionando.
            </p>
          </div>

          <div className="space-y-6 px-8 py-8">
            {/* Status do Supabase */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                    isConnected === true ? "bg-emerald-100 text-emerald-700" : 
                    isConnected === false ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Status do Supabase</h2>
                  <p className={`mt-1 text-sm ${
                    isConnected === true ? "text-emerald-700" : 
                    isConnected === false ? "text-rose-700" : "text-amber-700"
                  }`}>
                    {isConnected === true && "Conexão com Supabase estabelecida com sucesso."}
                    {isConnected === false && "Falha na conexão com Supabase."}
                    {isConnected === null && "Verificando conexão..."}
                  </p>
                  {testResult && (
                    <pre className="mt-2 text-xs text-slate-600 bg-slate-100 p-2 rounded">
                      {testResult}
                    </pre>
                  )}
                </div>
              </div>
            </section>

            {/* Teste de Gravação */}
            <section className="rounded-2xl border border-dashed border-slate-300 p-6">
              <h2 className="text-base font-semibold text-slate-900">Teste de Gravação</h2>
              <p className="mt-2 text-sm text-slate-600">
                Clique no botão abaixo para tentar gravar um documento na tabela "testes" do Supabase.
              </p>
              <button 
                onClick={gravarTeste}
                className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                disabled={isConnected !== true}
              >
                Enviar dado de teste
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}