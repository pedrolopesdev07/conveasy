import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Pencil,
  FileText,
  History,
  Info,
  Download,
  Upload,
  Trash2,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { Header } from "../components/Header";
import { ConvenioStatusBadge } from "../components/StatusBadge";
import { Convenio } from "../data/mockData";
import { ConvenioService } from "../services/ConvenioService";

type Tab = "dados" | "documentos" | "historico";

const tipoIcon: Record<string, React.ReactNode> = {
  criacao: <CheckCircle2 size={14} className="text-green-500" />,
  renovacao: <CheckCircle2 size={14} className="text-blue-500" />,
  alteracao: <Info size={14} className="text-amber-500" />,
  suspensao: <AlertTriangle size={14} className="text-red-500" />,
  encerramento: <XCircle size={14} className="text-gray-400" />,
};

const tipoLabel: Record<string, string> = {
  criacao: "Criação",
  renovacao: "Renovação",
  alteracao: "Alteração",
  suspensao: "Suspensão",
  encerramento: "Encerramento",
};

const tipoColors: Record<string, string> = {
  criacao: "bg-green-50 border-green-100",
  renovacao: "bg-blue-50 border-blue-100",
  alteracao: "bg-amber-50 border-amber-100",
  suspensao: "bg-red-50 border-red-100",
  encerramento: "bg-gray-50 border-gray-100",
};

export default function ConvenioDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("dados");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [conv, setConv] = useState<Convenio | null>(null);
  const [loading, setLoading] = useState(true);

  const recarregarConvenio = () => {
    if (id) ConvenioService.getById(id).then(setConv);
  };

  useEffect(() => {
    if (id) {
      ConvenioService.getById(id)
        .then(setConv)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleView = (storagePath?: string) => {
    if (!storagePath) return;
    window.open(ConvenioService.getDocumentoUrl(storagePath), "_blank");
  };

  const handleDownload = (storagePath?: string, nome?: string) => {
    if (!storagePath) return;
    window.open(ConvenioService.getDocumentoUrl(storagePath, nome), "_blank");
  };

  const handleDeleteDoc = async (docId: string, storagePath?: string, docNome?: string) => {
    setDeletingDocId(docId);
    try {
      await ConvenioService.removerDocumento(docId, storagePath);
      if (id) {
        await ConvenioService.adicionarHistorico(id, "alteracao", `Documento "${docNome ?? "arquivo"}" removido`);
      }
      recarregarConvenio();
    } catch (e: any) {
      alert("Erro ao excluir documento: " + e.message);
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleUpload = async (file: File) => {
    if (!id) return;
    setUploading(true);
    try {
      await ConvenioService.uploadDocumento(id, file);
      setUploadedFile(file.name);
      recarregarConvenio();
    } catch (e: any) {
      alert("Erro ao enviar arquivo: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
        <XCircle size={0} className="hidden" />
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!conv) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <Header title="Convênio não encontrado" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Convênio não encontrado.</p>
            <button onClick={() => navigate("/convenios")} className="mt-3 text-sm text-blue-600 hover:underline">
              Voltar à lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  const calcDaysToExpire = () => {
    const today = new Date();
    const end = new Date(conv.dataTermino);
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const days = calcDaysToExpire();

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dados", label: "Dados do Convênio", icon: <Info size={15} /> },
    { key: "documentos", label: `Documentos (${conv.documentos.length})`, icon: <FileText size={15} /> },
    { key: "historico", label: "Histórico", icon: <History size={15} /> },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Detalhes do Convênio" subtitle={conv.empresaNome} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header card */}
          <div className="flex items-start justify-between mb-5">
            <button
              onClick={() => navigate("/convenios")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
            <button
              onClick={() => navigate(`/convenios/${conv.id}/editar`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Pencil size={15} /> Editar
            </button>
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-gray-900">{conv.empresaNome}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{conv.descricao}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ConvenioStatusBadge status={conv.status} />
                {conv.status === "a_vencer" && days > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                    <Clock size={14} className="text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Vence em {days} dia{days !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Responsável</p>
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{conv.responsavel}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Data de Início</p>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{conv.dataInicio}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Data de Término</p>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{conv.dataTermino}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Documentos</p>
                <div className="flex items-center gap-1.5">
                  <FileText size={13} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{conv.documentos.length} arquivo{conv.documentos.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Dados */}
              {activeTab === "dados" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-700 mb-3">Informações Gerais</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Empresa", value: conv.empresaNome },
                        { label: "Responsável", value: conv.responsavel },
                        { label: "Data de Início", value: conv.dataInicio },
                        { label: "Data de Término", value: conv.dataTermino },
                        { label: "Status", value: <ConvenioStatusBadge status={conv.status} /> },
                        { label: "Criado em", value: conv.createdAt },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-lg p-3.5">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <div className="text-sm font-medium text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-700 mb-3">Descrição / Objeto</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{conv.descricao}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documentos */}
              {activeTab === "documentos" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-gray-700">Arquivos do Convênio</h4>
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
                      <Upload size={15} />
                      {uploading ? "Enviando..." : "Upload"}
                      <input
                        type="file"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                        }}
                      />
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="flex items-center gap-3 p-3 mb-3 bg-green-50 border border-green-100 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-700">"{uploadedFile}" enviado com sucesso</p>
                      <button onClick={() => setUploadedFile(null)} className="ml-auto text-xs text-green-600 hover:text-green-700">Fechar</button>
                    </div>
                  )}

                  {conv.documentos.length === 0 && !uploadedFile ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <FileText size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Nenhum documento cadastrado</p>
                      <p className="text-gray-400 text-xs mt-1">Faça upload do primeiro documento</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conv.documentos.map((doc) => {
                        const ext = doc.tipo;
                        const colors: Record<string, string> = {
                          PDF: "bg-red-50 text-red-600",
                          XLSX: "bg-green-50 text-green-600",
                          DOCX: "bg-blue-50 text-blue-600",
                          DOC: "bg-blue-50 text-blue-600",
                        };
                        return (
                          <div key={doc.id} className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[ext] || "bg-gray-100 text-gray-600"}`}>
                              <span className="text-xs font-bold">{ext}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.nome}</p>
                              <p className="text-xs text-gray-500">{doc.tamanho} · Enviado em {doc.uploadedAt} por {doc.uploadedBy}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => handleView(doc.storagePath)}
                                title="Visualizar"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={() => handleDownload(doc.storagePath, doc.nome)}
                                title="Baixar"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Download size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.id, doc.storagePath, doc.nome)}
                                disabled={deletingDocId === doc.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Histórico */}
              {activeTab === "historico" && (
                <div>
                  <h4 className="text-gray-700 mb-4">Linha do Tempo</h4>
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
                    <div className="space-y-4">
                      {conv.historico.map((item, idx) => (
                        <div key={item.id} className="flex gap-4 relative">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${tipoColors[item.tipo]}`}>
                            {tipoIcon[item.tipo]}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="bg-gray-50 rounded-lg border border-gray-100 p-3.5">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-1 ${tipoColors[item.tipo]}`}>
                                    {tipoLabel[item.tipo]}
                                  </span>
                                  <p className="text-sm text-gray-700">{item.descricao}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs text-gray-500">{item.data}</p>
                                  <p className="text-xs text-gray-400">{item.usuario}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
