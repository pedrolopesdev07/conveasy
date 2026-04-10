import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Handshake,
  Clock,
  FileText,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Header } from "../components/Header";
import { ConvenioService } from "../services/ConvenioService";
import { EmpresaService } from "../services/EmpresaService";
import { AlertaService } from "../services/AlertaService";
import { DocumentoService } from "../services/DocumentoService";
import { ConvenioStatusBadge } from "../components/StatusBadge";

export default function Dashboard() {
  const navigate = useNavigate();
  const [convenios, setConvenios] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [conveniosData, empresasData, alertasData, documentosData] = await Promise.all([
        ConvenioService.getAll(),
        EmpresaService.getAll(),
        AlertaService.getAll(),
        DocumentoService.getAll(),
      ]);

      setConvenios(conveniosData);
      setEmpresas(empresasData);
      setAlertas(alertasData);
      setDocumentos(documentosData);

      // Sincronizar alertas automaticamente
      await AlertaService.sincronizarAlertas();

    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const stats = {
    totalConvenios: convenios.length,
    conveniosAtivos: convenios.filter((c: any) => c.status === "ativo").length,
    conveniosVencendo: convenios.filter((c: any) => {
      const hoje = new Date();
      const vencimento = new Date(c.dataTermino);
      const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias <= 30 && diffDias >= 0;
    }).length,
    totalEmpresas: empresas.length,
    totalAlertas: alertas.length,
    alertasNaoLidas: alertas.filter((a: any) => !a.lido).length,
    totalDocumentos: documentos.length,
  };

  // Preparar dados para gráficos
  const conveniosPorStatus = [
    { name: "Ativos", value: stats.conveniosAtivos, color: "#10B981" },
    { name: "Vencendo", value: stats.conveniosVencendo, color: "#F59E0B" },
    { name: "Encerrados", value: convenios.filter((c: any) => c.status === "encerrado").length, color: "#6B7280" },
  ];

  const conveniosPorRamo = convenios.reduce((acc: any, conv: any) => {
    const ramo = conv.ramo || "Não informado";
    acc[ramo] = (acc[ramo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const conveniosPorRamoData = Object.entries(conveniosPorRamo).map(([ramo, quantidade]) => ({
    ramo,
    quantidade,
  }));

  // Alertas recentes
  const alertasRecentes = alertas
    .filter((a: any) => !a.lido)
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Convênios recentes
  const conveniosRecentes = convenios
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header/>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header/>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Dashboard" subtitle="Visão geral do sistema de convênios" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div
            onClick={() => navigate("/empresas")}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">+{stats.totalEmpresas} total</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 mb-0.5">{stats.totalEmpresas}</p>
            <p className="text-sm text-gray-500">Empresas Conveniadas</p>
          </div>

          <div
            onClick={() => navigate("/convenios")}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Handshake size={20} className="text-green-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">{stats.conveniosAtivos} ativos</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 mb-0.5">{stats.totalConvenios}</p>
            <p className="text-sm text-gray-500">Convênios Cadastrados</p>
          </div>

          <div
            onClick={() => navigate("/convenios")}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Clock size={20} className="text-orange-600" />
              </div>
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">Atenção</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 mb-0.5">{stats.conveniosVencendo}</p>
            <p className="text-sm text-gray-500">Convênios Vencendo</p>
          </div>

          <div
            onClick={() => navigate("/alertas")}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">{stats.alertasNaoLidas} não lidas</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 mb-0.5">{stats.totalAlertas}</p>
            <p className="text-sm text-gray-500">Alertas do Sistema</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Convênios por Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Convênios por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conveniosPorStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conveniosPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Convênios por Ramo */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Convênios por Ramo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conveniosPorRamoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ramo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Alertas Recentes */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertas Recentes</h3>
              <button
                onClick={() => navigate("/alertas")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {alertasRecentes.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum alerta recente</p>
              ) : (
                alertasRecentes.map((alerta: any) => (
                  <div key={alerta.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alerta.prioridade === 'critica' ? 'bg-red-500' :
                      alerta.prioridade === 'alta' ? 'bg-orange-500' :
                      alerta.prioridade === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alerta.titulo}</p>
                      <p className="text-xs text-gray-500">{alerta.mensagem}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(alerta.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Convênios Recentes */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Convênios Recentes</h3>
              <button
                onClick={() => navigate("/convenios")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {conveniosRecentes.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum convênio recente</p>
              ) : (
                conveniosRecentes.map((convenio: any) => (
                  <div key={convenio.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{convenio.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <ConvenioStatusBadge status={convenio.status} />
                        <span className="text-xs text-gray-500">
                          {new Date(convenio.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
