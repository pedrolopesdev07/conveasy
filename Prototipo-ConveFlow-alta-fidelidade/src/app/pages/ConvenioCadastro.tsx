import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Header } from "../components/Header";
import { Empresa } from "../data/mockData";
import { EmpresaService } from "../services/EmpresaService";
import { ConvenioService } from "../services/ConvenioService";

export default function ConvenioCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [saved, setSaved] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSearch, setEmpresaSearch] = useState("");
  const [showEmpresaDropdown, setShowEmpresaDropdown] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    dataInicio: "",
    dataTermino: "",
    status: "ativo",
    responsavel: "",
    descricao: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    EmpresaService.getAll().then(setEmpresas).catch(console.error);

    if (isEdit && id) {
      ConvenioService.getById(id).then((conv) => {
        if (conv) {
          setEmpresaSearch(conv.empresaNome);
          setSelectedEmpresa(conv.empresaId);
          setForm({
            dataInicio: conv.dataInicio,
            dataTermino: conv.dataTermino,
            status: conv.status,
            responsavel: conv.responsavel,
            descricao: conv.descricao,
          });
        }
      });
    }
  }, [id, isEdit]);

  const filteredEmpresas = empresas.filter(
    (e) =>
      e.nomeFantasia.toLowerCase().includes(empresaSearch.toLowerCase()) ||
      e.razaoSocial.toLowerCase().includes(empresaSearch.toLowerCase()),
  );

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedEmpresa)
      newErrors.empresa = "Selecione uma empresa";
    if (!form.dataInicio)
      newErrors.dataInicio = "Campo obrigatório";
    if (!form.dataTermino)
      newErrors.dataTermino = "Campo obrigatório";
    if (!form.responsavel.trim())
      newErrors.responsavel = "Campo obrigatório";
    if (!form.descricao.trim())
      newErrors.descricao = "Campo obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const empresaSelecionada = empresas.find((e) => e.id === selectedEmpresa);
      await ConvenioService.save(
        {
          ...form,
          status: form.status as import("../data/mockData").ConvenioStatus,
          empresaId: selectedEmpresa,
          empresaNome: empresaSelecionada?.nomeFantasia ?? empresaSearch,
        },
        isEdit ? id : undefined,
      );
      setSaved(true);
      setTimeout(() => navigate("/convenios"), 1500);
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  if (saved) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2
              size={32}
              className="text-green-600"
            />
          </div>
          <h3 className="text-gray-900 mb-1">
            Convênio {isEdit ? "atualizado" : "cadastrado"} com
            sucesso!
          </h3>
          <p className="text-gray-500 text-sm">
            Redirecionando para a lista...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        title={isEdit ? "Editar Convênio" : "Novo Convênio"}
        subtitle={
          isEdit
            ? `Editando convênio: ${empresaSearch}`
            : "Cadastre um novo convênio empresarial"
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/convenios")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar à lista
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Empresa */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Empresa Conveniada
              </h3>
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1.5">
                  Empresa{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={empresaSearch}
                    onChange={(e) => {
                      setEmpresaSearch(e.target.value);
                      setShowEmpresaDropdown(true);
                      setSelectedEmpresa("");
                    }}
                    onFocus={() => setShowEmpresaDropdown(true)}
                    placeholder="Digite para buscar empresa..."
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.empresa
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-white"
                    }`}
                  />
                </div>
                {errors.empresa && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.empresa}
                  </p>
                )}

                {showEmpresaDropdown &&
                  filteredEmpresas.length > 0 && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() =>
                          setShowEmpresaDropdown(false)
                        }
                      />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {filteredEmpresas
                          .slice(0, 5)
                          .map((emp) => (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => {
                                setSelectedEmpresa(emp.id);
                                setEmpresaSearch(
                                  emp.nomeFantasia,
                                );
                                setShowEmpresaDropdown(false);
                                if (errors.empresa)
                                  setErrors((prev) => {
                                    const n = { ...prev };
                                    delete n.empresa;
                                    return n;
                                  });
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-blue-600">
                                  {emp.nomeFantasia[0]}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {emp.nomeFantasia}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {emp.cnpj} ·{" "}
                                  {emp.ramoAtividade}
                                </p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </>
                  )}
              </div>

              {selectedEmpresa && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  {(() => {
                    const emp = empresas.find(
                      (e) => e.id === selectedEmpresa,
                    );
                    return emp ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {emp.nomeFantasia}
                          </p>
                          <p className="text-xs text-blue-600">
                            {emp.razaoSocial} · {emp.cnpj}
                          </p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {emp.ramoAtividade}
                        </span>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            {/* Dados do convênio */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Dados do Convênio
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Data de Início{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.dataInicio}
                      onChange={(e) =>
                        update("dataInicio", e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.dataInicio
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    />
                    {errors.dataInicio && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.dataInicio}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Data de Término{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.dataTermino}
                      onChange={(e) =>
                        update("dataTermino", e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.dataTermino
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    />
                    {errors.dataTermino && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.dataTermino}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        update("status", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="suspenso">Suspenso</option>
                      <option value="encerrado">
                        Encerrado
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Responsável{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.responsavel}
                      onChange={(e) =>
                        update("responsavel", e.target.value)
                      }
                      placeholder="Nome do responsável"
                      className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.responsavel
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    />
                    {errors.responsavel && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.responsavel}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">
                    Descrição / Objeto do Convênio{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) =>
                      update("descricao", e.target.value)
                    }
                    rows={3}
                    placeholder="Descreva o objeto do convênio, benefícios oferecidos..."
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.descricao
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-white"
                    }`}
                  />
                  {errors.descricao && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.descricao}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Documento Inicial (Minuta)
              </h3>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">
                        PDF
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {uploadedFile}
                      </p>
                      <p className="text-xs text-gray-500">
                        Arquivo selecionado
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="ml-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload
                      size={28}
                      className="text-gray-400 mx-auto mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-1">
                      Arraste e solte o arquivo aqui
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      PDF, DOC, DOCX — máx. 10 MB
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload size={14} />
                      Selecionar arquivo
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-2">
              <button
                type="button"
                onClick={() => navigate("/convenios")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-colors"
              >
                <X size={16} /> Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Save size={16} />{" "}
                {isEdit
                  ? "Salvar alterações"
                  : "Cadastrar convênio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}