import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, X, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { EmpresaService } from "../services/EmpresaService";

// Componente de Campo de Entrada Independente (Mantém o foco do teclado)
const InputField = ({ 
  label, field, form, update, errors, type = "text", placeholder, required = false, className = "", children 
}: any) => (
  <div className={className}>
    <label className="block text-sm text-gray-700 mb-1.5 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children ? children : (
      <input
        type={type}
        value={form[field] || ""}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          errors[field] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
      />
    )}
    {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
  </div>
);

export default function EmpresaCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id); 

  const [loadingCep, setLoadingCep] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({
    razaoSocial: "", nomeFantasia: "", cnpj: "", ramoAtividade: "",
    cep: "", endereco: "", cidade: "", estado: "",
    telefone: "", email: "", site: "",
    representanteLegal: "", cargo: "", contato: "",
    status: "ativa", latitude: "", longitude: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      EmpresaService.getById(id).then(dados => {
        if (dados) setForm(dados);
      });
    }
  }, [id, isEdit]);

  const update = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  // 🌍 Integração Real com API de CEP via Service
  const buscarCep = async () => {
    const cepClean = form.cep.replace(/\D/g, "");
    if (cepClean.length !== 8) return;

    setLoadingCep(true);
    try {
      const resultado = await EmpresaService.consultarCep(cepClean);
      if (resultado) {
        setForm((prev: any) => ({
          ...prev,
          endereco: resultado.endereco,
          cidade: resultado.cidade,
          estado: resultado.estado,
        }));
      } else {
        setErrors(prev => ({ ...prev, cep: "CEP não encontrado" }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCep(false);
    }
  };

  // 📍 Simulação de Localização por Mapa
  const handleLocalizacaoManual = () => {
    const latFake = "-2.5307"; 
    const longFake = "-44.3068";
    const cepFake = "65000-000";

    setForm((prev: any) => ({
      ...prev,
      latitude: latFake,
      longitude: longFake,
      cep: cepFake
    }));
    buscarCep(); // Sincroniza o endereço após mudar o CEP pelo mapa
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const obrigatorios = ["razaoSocial", "nomeFantasia", "cnpj", "ramoAtividade", "email", "telefone", "representanteLegal"];
    obrigatorios.forEach(field => {
      if (!form[field]?.trim()) newErrors[field] = "Campo obrigatório";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await EmpresaService.save(form, id);
      setSaved(true);
      setTimeout(() => navigate("/empresas"), 2000);
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    }
  };

  if (saved) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <CheckCircle2 size={64} className="text-green-600 mb-4" />
        <h3 className="text-xl font-bold">Empresa salva com sucesso!</h3>
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col overflow-hidden bg-gray-50">
      <Header title={isEdit ? "Editar Empresa" : "Nova Empresa"} subtitle="Gerenciamento de dados cadastrais" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/empresas")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors">
            <ArrowLeft size={16} /> Voltar à lista
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4 border-b pb-2 text-gray-900">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Razão Social" field="razaoSocial" placeholder="Empresa Exemplo Ltda" required className="md:col-span-2" form={form} update={update} errors={errors} />
                <InputField label="Nome Fantasia" field="nomeFantasia" placeholder="Empresa Exemplo" required form={form} update={update} errors={errors} />
                <InputField label="CNPJ" field="cnpj" placeholder="00.000.000/0001-00" required form={form} update={update} errors={errors} />
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">Ramo de Atividade <span className="text-red-500">*</span></label>
                  <select value={form.ramoAtividade} onChange={(e) => update("ramoAtividade", e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione...</option>
                    <option>Alimentação</option><option>Saúde</option><option>Educação</option><option>Varejo</option><option>Tecnologia</option>
                  </select>
                  {errors.ramoAtividade && <p className="text-xs text-red-500 mt-1">{errors.ramoAtividade}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ativa">Ativa</option><option value="inativa">Inativa</option><option value="suspensa">Suspensa</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4 border-b pb-2 text-gray-900">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="CEP" field="cep" form={form} update={update} errors={errors}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.cep || ""}
                      onChange={(e) => update("cep", e.target.value)}
                      onBlur={buscarCep}
                      placeholder="00000-000"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleLocalizacaoManual}
                      disabled={loadingCep}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm transition-colors flex items-center justify-center"
                    >
                      {loadingCep ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                    </button>
                  </div>
                </InputField>
                <InputField label="Endereço completo" field="endereco" placeholder="Rua, número, bairro" className="md:col-span-2" form={form} update={update} errors={errors} />
                <InputField label="Cidade" field="cidade" placeholder="São Luís" form={form} update={update} errors={errors} />
                <InputField label="Estado" field="estado" placeholder="MA" form={form} update={update} errors={errors} />
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className="text-gray-500" />
                  <p className="text-sm text-gray-600">Localização Geográfica</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Latitude" field="latitude" placeholder="-2.5307" form={form} update={update} errors={errors} />
                  <InputField label="Longitude" field="longitude" placeholder="-44.3068" form={form} update={update} errors={errors} />
                </div>
                <p className="text-xs text-gray-400 mt-2">Preenchido automaticamente ao buscar o CEP ou via mapa</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4 border-b pb-2 text-gray-900">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Telefone" field="telefone" placeholder="(98) 3000-0000" required form={form} update={update} errors={errors} />
                <InputField label="E-mail" field="email" placeholder="contato@empresa.com.br" required type="email" form={form} update={update} errors={errors} />
                <InputField label="Site" field="site" placeholder="www.empresa.com.br" form={form} update={update} errors={errors} />
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4 border-b pb-2 text-gray-900">Representante Legal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Nome" field="representanteLegal" placeholder="Nome completo" required form={form} update={update} errors={errors} />
                <InputField label="Cargo" field="cargo" placeholder="Diretor, Gerente..." form={form} update={update} errors={errors} />
                <InputField label="Contato" field="contato" placeholder="(98) 9 0000-0000" form={form} update={update} errors={errors} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pb-2">
              <button type="button" onClick={() => navigate("/empresas")} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                <X size={16} className="inline mr-2" /> Cancelar
              </button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Save size={16} /> {isEdit ? "Salvar alterações" : "Cadastrar empresa"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}