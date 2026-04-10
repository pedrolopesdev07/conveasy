import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Pencil,
  Building2,
  Info,
  FileText,
  XCircle,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Header } from "../components/Header";
import { EmpresaStatusBadge, ConvenioStatusBadge } from "../components/StatusBadge";
import { Empresa, Convenio } from "../data/mockData";
import { EmpresaService } from "../services/EmpresaService";
import { ConvenioService } from "../services/ConvenioService";

type Tab = "dados" | "convenios";

export default function EmpresaDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("dados");
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      EmpresaService.getById(id),
      ConvenioService.getAll(),
    ])
      .then(([emp, allConvenios]) => {
        setEmpresa(emp);
        setConvenios(allConvenios.filter((c) => c.empresaId === id));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <Header title="Empresa não encontrada" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Empresa não encontrada.</p>
            <button onClick={() => navigate("/empresas")} className="mt-3 text-sm text-blue-600 hover:underline">
              Voltar à lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dados", label: "Dados da Empresa", icon: <Info size={15} /> },
    { key: "convenios", label: `Convênios (${convenios.length})`, icon: <FileText size={15} /> },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Detalhes da Empresa" subtitle={empresa.nomeFantasia} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Navegação */}
          <div className="flex items-start justify-between mb-5">
            <button
              onClick={() => navigate("/empresas")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
            <button
              onClick={() => navigate(`/empresas/${empresa.id}/editar`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Pencil size={15} /> Editar
            </button>
          </div>

          {/* Card resumo */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-gray-900">{empresa.nomeFantasia}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{empresa.razaoSocial}</p>
                </div>
              </div>
              <EmpresaStatusBadge status={empresa.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">CNPJ</p>
                <p className="text-sm font-medium text-gray-900 font-mono">{empresa.cnpj}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Ramo de Atividade</p>
                <p className="text-sm font-medium text-gray-900">{empresa.ramoAtividade}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Cidade</p>
                <p className="text-sm font-medium text-gray-900">{empresa.cidade} / {empresa.estado}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Convênios</p>
                <p className="text-sm font-medium text-gray-900">{convenios.length} convênio{convenios.length !== 1 ? "s" : ""}</p>
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
                        { label: "Razão Social", value: empresa.razaoSocial, icon: <Building2 size={13} className="text-gray-400" /> },
                        { label: "Nome Fantasia", value: empresa.nomeFantasia, icon: <Building2 size={13} className="text-gray-400" /> },
                        { label: "CNPJ", value: empresa.cnpj, icon: <Briefcase size={13} className="text-gray-400" />, mono: true },
                        { label: "Ramo de Atividade", value: empresa.ramoAtividade, icon: <Briefcase size={13} className="text-gray-400" /> },
                        { label: "Status", value: <EmpresaStatusBadge status={empresa.status} />, icon: null },
                        { label: "Cadastrado em", value: empresa.createdAt, icon: <Calendar size={13} className="text-gray-400" /> },
                      ].map(({ label, value, icon, mono }) => (
                        <div key={label} className="bg-gray-50 rounded-lg p-3.5">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <div className={`flex items-center gap-1.5 text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>
                            {icon}
                            <span>{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-700 mb-3">Contato</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "E-mail", value: empresa.email, icon: <Mail size={13} className="text-gray-400" /> },
                        { label: "Telefone", value: empresa.telefone, icon: <Phone size={13} className="text-gray-400" /> },
                        ...(empresa.site ? [{ label: "Site", value: empresa.site, icon: <Globe size={13} className="text-gray-400" /> }] : []),
                        { label: "Contato Direto", value: empresa.contato, icon: <Phone size={13} className="text-gray-400" /> },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-gray-50 rounded-lg p-3.5">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                            {icon}
                            <span>{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-700 mb-3">Endereço</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{empresa.endereco}</p>
                          <p className="text-sm text-gray-600">{empresa.cidade} – {empresa.estado}</p>
                          <p className="text-xs text-gray-400 mt-0.5">CEP: {empresa.cep}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-700 mb-3">Representante Legal</h4>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{empresa.representanteLegal}</p>
                        <p className="text-xs text-gray-500">{empresa.cargo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Convênios */}
              {activeTab === "convenios" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-gray-700">Convênios Vinculados</h4>
                    <button
                      onClick={() => navigate("/convenios/novo")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Novo Convênio
                    </button>
                  </div>

                  {convenios.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <FileText size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Nenhum convênio cadastrado</p>
                      <p className="text-gray-400 text-xs mt-1">Esta empresa ainda não possui convênios</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {convenios.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => navigate(`/convenios/${conv.id}`)}
                          className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{conv.descricao}</p>
                            <p className="text-xs text-gray-500">{conv.dataInicio} → {conv.dataTermino} · Resp: {conv.responsavel}</p>
                          </div>
                          <ConvenioStatusBadge status={conv.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
