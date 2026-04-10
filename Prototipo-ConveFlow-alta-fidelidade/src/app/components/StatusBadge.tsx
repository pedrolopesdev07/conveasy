import React from "react";
import { ConvenioStatus, EmpresaStatus, UsuarioPerfil } from "../data/mockData";

interface ConvenioStatusBadgeProps {
  status: ConvenioStatus;
}

export function ConvenioStatusBadge({ status }: ConvenioStatusBadgeProps) {
  const map: Record<ConvenioStatus, { label: string; className: string }> = {
    ativo: { label: "Ativo", className: "bg-green-100 text-green-700 border border-green-200" },
    suspenso: { label: "Suspenso", className: "bg-amber-100 text-amber-700 border border-amber-200" },
    encerrado: { label: "Encerrado", className: "bg-gray-100 text-gray-600 border border-gray-200" },
    a_vencer: { label: "A Vencer", className: "bg-red-100 text-red-700 border border-red-200" },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

interface EmpresaStatusBadgeProps {
  status: EmpresaStatus;
}

export function EmpresaStatusBadge({ status }: EmpresaStatusBadgeProps) {
  const map: Record<EmpresaStatus, { label: string; className: string }> = {
    ativa: { label: "Ativa", className: "bg-green-100 text-green-700 border border-green-200" },
    inativa: { label: "Inativa", className: "bg-gray-100 text-gray-600 border border-gray-200" },
    suspensa: { label: "Suspensa", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

interface PerfilBadgeProps {
  perfil: UsuarioPerfil;
}

export function PerfilBadge({ perfil }: PerfilBadgeProps) {
  const map: Record<UsuarioPerfil, { label: string; className: string }> = {
    admin: { label: "Administrador", className: "bg-blue-100 text-blue-700 border border-blue-200" },
    gestor: { label: "Gestor", className: "bg-purple-100 text-purple-700 border border-purple-200" },
    estagiario: { label: "Estagiário", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  };
  const { label, className } = map[perfil];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
