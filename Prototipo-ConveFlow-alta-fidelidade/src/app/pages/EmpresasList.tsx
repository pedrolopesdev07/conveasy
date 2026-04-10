import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, Eye, Pencil, Trash2, Building2, ChevronDown, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { EmpresaStatusBadge } from "../components/StatusBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { Empresa, EmpresaStatus } from "../data/mockData";
import { EmpresaService } from "../services/EmpresaService"; // Importando o Service

export default function EmpresasList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmpresaStatus | "todos">("todos");
  const [ramoFilter, setRamoFilter] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; nome: string }>({ open: false, id: "", nome: "" });
  
  const [empresaList, setEmpresaList] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Carregamento de dados centralizado via Service
  const carregarEmpresas = async () => {
    setLoading(true);
    try {
      const dados = await EmpresaService.getAll();
      setEmpresaList(dados);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEmpresas();
  }, []);

  // 2. Lógica de deleção delegada ao Service
  const handleDelete = async () => {
    try {
      await EmpresaService.delete(deleteModal.id);
      // Atualiza a lista local para refletir a exclusão sem precisar de novo reload completo
      setEmpresaList((prev) => prev.filter((e) => e.id !== deleteModal.id));
      setDeleteModal({ open: false, id: "", nome: "" });
    } catch (error) {
      alert("Erro ao excluir no servidor.");
    }
  };

  const ramos = ["todos", ...Array.from(new Set(empresaList.map((e) => e.ramoAtividade)))];

  const filtered = empresaList.filter((emp) => {
    const matchSearch =
      (emp.nomeFantasia?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (emp.razaoSocial?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (emp.cnpj || "").includes(search);
    const matchStatus = statusFilter === "todos" || emp.status === statusFilter;
    const matchRamo = ramoFilter === "todos" || emp.ramoAtividade === ramoFilter;
    return matchSearch && matchStatus && matchRamo;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Empresas" subtitle="Gerenciamento de empresas conveniadas" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              onClick={() => navigate("/empresas/nova")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Nova Empresa
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EmpresaStatus | "todos")}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
                <option value="suspensa">Suspensa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ramo de Atividade</label>
              <select
                value={ramoFilter}
                onChange={(e) => setRamoFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ramos.map((r) => (
                  <option key={r} value={r}>{r === "todos" ? "Todos" : r}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setStatusFilter("todos"); setRamoFilter("todos"); setSearch(""); }}
                className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          <p className="text-sm text-gray-500">{filtered.length} empresa{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
              <p className="text-gray-500 text-sm">Carregando empresas...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Empresa</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">CNPJ</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Ramo</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contato</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma empresa encontrada</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Building2 size={15} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{emp.nomeFantasia}</p>
                              <p className="text-xs text-gray-500 truncate">{emp.razaoSocial}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{emp.cnpj}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{emp.ramoAtividade}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-gray-700 text-xs">{emp.telefone}</p>
                          <p className="text-gray-400 text-xs truncate max-w-[160px]">{emp.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <EmpresaStatusBadge status={emp.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => navigate(`/empresas/${emp.id}`)} title="Visualizar" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Eye size={15} />
                            </button>
                            <button onClick={() => navigate(`/empresas/${emp.id}/editar`)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleteModal({ open: true, id: emp.id, nome: emp.nomeFantasia })} title="Excluir" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && !loading && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Exibindo {filtered.length} registros</p>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">Anterior</button>
                <button className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md">1</button>
                <button className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">Próximo</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={deleteModal.open}
        title="Excluir Empresa"
        description={`Tem certeza que deseja excluir a empresa "${deleteModal.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: "", nome: "" })}
      />
    </div>
  );
}