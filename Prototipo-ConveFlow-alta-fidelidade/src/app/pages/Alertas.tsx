import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  History,
  Eye,
  Check,
  CheckCheck,
  Filter,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Header } from "../components/Header";
import { Alerta } from "../data/mockData";
import { AlertaService } from "../services/AlertaService";

type FilterType = "todos" | "nao_lidos" | "vencimentos" | "acoes";

const tipoConfig: Record<Alerta["tipo"], { label: string; icon: React.ReactNode; cardClass: string; iconClass: string }> = {
  vencimento_7: {
    label: "Vence em 7 dias",
    icon: <XCircle size={16} />,
    cardClass: "border-red-200 bg-red-50",
    iconClass: "text-red-500 bg-red-100",
  },
  vencimento_15: {
    label: "Vence em 15 dias",
    icon: <AlertTriangle size={16} />,
    cardClass: "border-amber-200 bg-amber-50",
    iconClass: "text-amber-500 bg-amber-100",
  },
  vencimento_30: {
    label: "Vence em 30 dias",
    icon: <Clock size={16} />,
    cardClass: "border-yellow-200 bg-yellow-50",
    iconClass: "text-yellow-600 bg-yellow-100",
  },
  renovacao_pendente: {
    label: "Renovação pendente",
    icon: <RefreshCw size={16} />,
    cardClass: "border-blue-200 bg-blue-50",
    iconClass: "text-blue-500 bg-blue-100",
  },
  acao_recente: {
    label: "Ação recente",
    icon: <History size={16} />,
    cardClass: "border-gray-200 bg-gray-50",
    iconClass: "text-gray-500 bg-gray-100",
  },
};

export default function Alertas() {
  const navigate = useNavigate();
  const [alertaList, setAlertaList] = useState<Alerta[]>([]);
  const [filter, setFilter] = useState<FilterType>("todos");

  useEffect(() => {
    AlertaService.sincronizarAlertas()
      .then(() => AlertaService.getAll())
      .then(setAlertaList)
      .catch((err) => console.error("Erro ao sincronizar alertas:", err));
  }, []);

  const filteredAlertas = alertaList.filter((a: Alerta) => {
    if (filter === "nao_lidos") return !a.lido;
    if (filter === "vencimentos") return a.tipo.startsWith("vencimento");
    if (filter === "acoes") return a.tipo === "acao_recente" || a.tipo === "renovacao_pendente";
    return true;
  });

  const unreadCount = alertaList.filter((a: Alerta) => !a.lido).length;

  const markAsRead = async (id: string) => {
    setAlertaList((prev: Alerta[]) => prev.map((a: Alerta) => (a.id === id ? { ...a, lido: true } : a)));
    try {
      await AlertaService.markAsRead(id);
    } catch (err) {
      console.error("Erro ao marcar alerta como lido:", err);
    }
  };

  const markAllAsRead = async () => {
    setAlertaList((prev: Alerta[]) => prev.map((a: Alerta) => ({ ...a, lido: true })));
    try {
      await AlertaService.markAllAsRead();
    } catch (err) {
      console.error("Erro ao marcar todos como lidos:", err);
    }
  };

  const filterButtons: { key: FilterType; label: string; count?: number }[] = [
    { key: "todos", label: "Todos", count: alertaList.length },
    { key: "nao_lidos", label: "Não lidos", count: unreadCount },
    { key: "vencimentos", label: "Vencimentos", count: alertaList.filter((a: Alerta) => a.tipo.startsWith("vencimento")).length },
    { key: "acoes", label: "Ações", count: alertaList.filter((a: Alerta) => a.tipo === "acao_recente" || a.tipo === "renovacao_pendente").length },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Alertas e Notificações" subtitle="Acompanhe vencimentos, renovações e ações recentes" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Vencem em 7 dias",
              count: alertaList.filter((a: Alerta) => a.tipo === "vencimento_7").length,
              icon: <XCircle size={18} />,
              color: "text-red-600",
              bg: "bg-red-50",
              border: "border-red-100",
            },
            {
              label: "Vencem em 15 dias",
              count: alertaList.filter((a: Alerta) => a.tipo === "vencimento_15").length,
              icon: <AlertTriangle size={18} />,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Vencem em 30 dias",
              count: alertaList.filter((a: Alerta) => a.tipo === "vencimento_30").length,
              icon: <Clock size={18} />,
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              border: "border-yellow-100",
            },
            {
              label: "Renovações pendentes",
              count: alertaList.filter((a: Alerta) => a.tipo === "renovacao_pendente").length,
              icon: <RefreshCw size={18} />,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
          ].map(({ label, count, icon, color, bg, border }) => (
            <div key={label} className={`bg-white rounded-xl border ${border} shadow-sm p-4`}>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <span className={color}>{icon}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter + actions */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {filterButtons.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filter === key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
                {count !== undefined && (
                  <span className={`text-xs px-1.5 py-0 rounded-full ${filter === key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
            >
              <CheckCheck size={15} />
              Marcar todos como lidos
            </button>
          )}
        </div>

        {/* Alert list */}
        {filteredAlertas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Bell size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Nenhum alerta encontrado</p>
            <p className="text-gray-400 text-xs mt-1">Todos os convênios estão em dia!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlertas.map((alerta: Alerta) => {
              const config = tipoConfig[alerta.tipo];
              return (
                <div
                  key={alerta.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    !alerta.lido ? config.cardClass : "bg-white border-gray-100"
                  } ${!alerta.lido ? "shadow-sm" : ""}`}
                >
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${config.iconClass}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-gray-900">{alerta.empresaNome}</p>
                          {!alerta.lido && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{alerta.mensagem}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400">{alerta.data}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            !alerta.lido ? "bg-white/80 text-gray-600" : "bg-gray-100 text-gray-500"
                          }`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/convenios/${alerta.convenioId}`)}
                          title="Ver convênio"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-blue-600 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        {!alerta.lido && (
                          <button
                            onClick={() => markAsRead(alerta.id)}
                            title="Marcar como lido"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-green-600 transition-colors"
                          >
                            <Check size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
