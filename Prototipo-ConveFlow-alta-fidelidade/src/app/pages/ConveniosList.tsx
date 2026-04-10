import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, Eye, Pencil, Trash2, Handshake, ChevronDown, Calendar, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { ConvenioStatusBadge } from "../components/StatusBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { Convenio, ConvenioStatus } from "../data/mockData";
import { ConvenioService } from "../services/ConvenioService";

export default function ConveniosList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConvenioStatus | "todos">("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; nome: string }>({ open: false, id: "", nome: "" });
  const [convenioList, setConvenioList] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarConvenios = async () => {
    setLoading(true);
    try {
      const dados = await ConvenioService.getAll();
      setConvenioList(dados);
    } catch (error) {
      console.error("Erro ao buscar convênios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConvenios();
  }, []);

  const filtered = convenioList.filter((conv) => {
    const matchSearch =
      conv.empresaNome.toLowerCase().includes(search.toLowerCase()) ||
      conv.responsavel.toLowerCase().includes(search.toLowerCase()) ||
      conv.descricao.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || conv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    try {
      await ConvenioService.delete(deleteModal.id);
      setConvenioList((prev) => prev.filter((c) => c.id !== deleteModal.id));
      setDeleteModal({ open: false, id: "", nome: "" });
    } catch (error) {
      alert("Erro ao excluir no servidor.");
    }
  };

  const calcDaysToExpire = (dataTermino: string) => {
    const today = new Date("2025-03-25");
    const end = new Date(dataTermino);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Convênios" subtitle="Gestão de convênios empresariais" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por empresa, responsável, descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                showFilters ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter size={15} />
              Filtros
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => navigate("/convenios/novo")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Novo Convênio
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ConvenioStatus | "todos")}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="a_vencer">A Vencer</option>
                <option value="suspenso">Suspenso</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setStatusFilter("todos"); setSearch(""); }}
                className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center flex-wrap gap-3 mb-4">
          <p className="text-sm text-gray-500">{filtered.length} convênio{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
          {(["ativo", "a_vencer", "suspenso", "encerrado"] as ConvenioStatus[]).map((s) => {
            const count = filtered.filter((c) => c.status === s).length;
            if (count === 0) return null;
            const colors: Record<ConvenioStatus, string> = {
              ativo: "text-green-600 bg-green-50",
              a_vencer: "text-red-600 bg-red-50",
              suspenso: "text-amber-600 bg-amber-50",
              encerrado: "text-gray-500 bg-gray-100",
            };
            const labels: Record<ConvenioStatus, string> = {
              ativo: "ativos",
              a_vencer: "a vencer",
              suspenso: "suspensos",
              encerrado: "encerrados",
            };
            return (
              <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${colors[s]}`}>
                {count} {labels[s]}
              </span>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
              <p className="text-gray-500 text-sm">Carregando convênios...</p>
            </div>
          ) : null}
          <div className={`overflow-x-auto ${loading ? "hidden" : ""}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Empresa</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Responsável</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Vigência</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Documentos</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Handshake size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Nenhum convênio encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((conv) => {
                    const days = calcDaysToExpire(conv.dataTermino);
                    return (
                      <tr key={conv.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Handshake size={15} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900">{conv.empresaNome}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{conv.descricao}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 text-xs">{conv.responsavel}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-start gap-1.5">
                            <Calendar size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-700">{conv.dataInicio} → {conv.dataTermino}</p>
                              {days > 0 && days <= 30 && (
                                <p className="text-xs text-red-500 mt-0.5">Vence em {days} dia{days !== 1 ? "s" : ""}</p>
                              )}
                              {days < 0 && conv.status !== "encerrado" && (
                                <p className="text-xs text-gray-400 mt-0.5">Expirado há {Math.abs(days)} dias</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {conv.documentos.length} arquivo{conv.documentos.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <ConvenioStatusBadge status={conv.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/convenios/${conv.id}`)}
                              title="Visualizar"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => navigate(`/convenios/${conv.id}/editar`)}
                              title="Editar"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, id: conv.id, nome: conv.empresaNome })}
                              title="Excluir"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Exibindo {filtered.length} de {convenioList.length} registros</p>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">Anterior</button>
                <button className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md">1</button>
                <button className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">Próximo</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={deleteModal.open}
        title="Excluir Convênio"
        description={`Tem certeza que deseja excluir o convênio com "${deleteModal.nome}"? Esta ação é irreversível.`}
        confirmLabel="Sim, excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: "", nome: "" })}
      />
    </div>
  );
}
