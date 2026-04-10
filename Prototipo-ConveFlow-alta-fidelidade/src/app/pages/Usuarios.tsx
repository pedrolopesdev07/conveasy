import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  Shield,
  Users,
  X,
  Save,
  CheckCircle2,
  Filter,
  Loader2,
} from "lucide-react";
import { Header } from "../components/Header";
import { PerfilBadge } from "../components/StatusBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { Usuario, UsuarioPerfil } from "../data/mockData";
import { UsuarioService } from "../services/UsuarioService";

export default function Usuarios() {
  const [usuarioList, setUsuarioList] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perfilFilter, setPerfilFilter] = useState<UsuarioPerfil | "todos">("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; nome: string }>({ open: false, id: "", nome: "" });
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    perfil: "gestor" as UsuarioPerfil,
    setor: "",
    status: "ativo" as "ativo" | "inativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const dados = await UsuarioService.getAll();
      setUsuarioList(dados);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const filtered = usuarioList.filter((u) => {
    const matchSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.setor.toLowerCase().includes(search.toLowerCase());
    const matchPerfil = perfilFilter === "todos" || u.perfil === perfilFilter;
    return matchSearch && matchPerfil;
  });

  const openAdd = () => {
    setEditingUser(null);
    setForm({ nome: "", email: "", perfil: "gestor", setor: "", status: "ativo" });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (user: Usuario) => {
    setEditingUser(user);
    setForm({ nome: user.nome, email: user.email, perfil: user.perfil, setor: user.setor, status: user.status });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nome.trim()) newErrors.nome = "Campo obrigatório";
    if (!form.email.trim()) newErrors.email = "Campo obrigatório";
    if (!form.setor.trim()) newErrors.setor = "Campo obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await UsuarioService.save(form, editingUser?.id);
      setSaved(true);
      setTimeout(async () => {
        setSaved(false);
        setShowModal(false);
        await carregarUsuarios();
      }, 1200);
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await UsuarioService.delete(deleteModal.id);
      setDeleteModal({ open: false, id: "", nome: "" });
      await carregarUsuarios();
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
    }
  };

  const perfilIcons: Record<UsuarioPerfil, React.ReactNode> = {
    admin: <Shield size={15} className="text-blue-600" />,
    gestor: <User size={15} className="text-purple-600" />,
    estagiario: <Users size={15} className="text-gray-500" />,
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <Header title="Usuários" subtitle="Gerenciamento de usuários e perfis de acesso" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Usuários" subtitle="Gerenciamento de usuários e perfis de acesso" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Administradores", count: usuarioList.filter((u) => u.perfil === "admin").length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Gestores", count: usuarioList.filter((u) => u.perfil === "gestor").length, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Estagiários", count: usuarioList.filter((u) => u.perfil === "estagiario").length, color: "text-gray-600", bg: "bg-gray-50" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <User size={18} className={color} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, setor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <select
                value={perfilFilter}
                onChange={(e) => setPerfilFilter(e.target.value as UsuarioPerfil | "todos")}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="todos">Todos os perfis</option>
                <option value="admin">Administrador</option>
                <option value="gestor">Gestor</option>
                <option value="estagiario">Estagiário</option>
              </select>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Novo Usuário
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Usuário</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Setor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Perfil</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Último acesso</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Users size={32} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Nenhum usuário encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const initials = user.nome
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                    const avatarColors = [
                      "from-blue-400 to-blue-600",
                      "from-purple-400 to-purple-600",
                      "from-green-400 to-green-600",
                      "from-amber-400 to-amber-600",
                    ];
                    const colorIdx = user.id.charCodeAt(1) % avatarColors.length;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[colorIdx]} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.nome}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 text-sm">{user.setor}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {perfilIcons[user.perfil]}
                            <PerfilBadge perfil={user.perfil} />
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.status === "ativo"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}>
                            {user.status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs">{user.ultimoAcesso}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(user)}
                              title="Editar"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, id: user.id, nome: user.nome })}
                              title="Excluir"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              disabled={user.perfil === "admin" && usuarioList.filter((u) => u.perfil === "admin").length === 1}
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !saved && setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {saved ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <p className="text-gray-900 font-medium">
                  Usuário {editingUser ? "atualizado" : "cadastrado"} com sucesso!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h3 className="text-gray-900">{editingUser ? "Editar Usuário" : "Novo Usuário"}</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(e) => { setForm((p) => ({ ...p, nome: e.target.value })); if (errors.nome) setErrors((p) => { const n = {...p}; delete n.nome; return n; }); }}
                      placeholder="Nome do usuário"
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.nome ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); if (errors.email) setErrors((p) => { const n = {...p}; delete n.email; return n; }); }}
                      placeholder="usuario@instituicao.edu.br"
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Perfil</label>
                      <select
                        value={form.perfil}
                        onChange={(e) => setForm((p) => ({ ...p, perfil: e.target.value as UsuarioPerfil }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="admin">Administrador</option>
                        <option value="gestor">Gestor</option>
                        <option value="estagiario">Estagiário</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "ativo" | "inativo" }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">
                      Setor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.setor}
                      onChange={(e) => { setForm((p) => ({ ...p, setor: e.target.value })); if (errors.setor) setErrors((p) => { const n = {...p}; delete n.setor; return n; }); }}
                      className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.setor ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    >
                      <option value="">Selecione o setor...</option>
                      <option value="TEIA">TEIA</option>
                      <option value="Núcleo de Carreiras">Núcleo de Carreiras</option>
                    </select>
                    {errors.setor && <p className="text-xs text-red-500 mt-1">{errors.setor}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Save size={15} />
                    {editingUser ? "Salvar alterações" : "Cadastrar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteModal.open}
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir o usuário "${deleteModal.nome}"? Ele perderá o acesso ao sistema.`}
        confirmLabel="Sim, excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: "", nome: "" })}
      />
    </div>
  );
}
