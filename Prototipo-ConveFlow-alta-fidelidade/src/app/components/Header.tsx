import React, { useState } from "react";
import { Bell, Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { alertas } from "../data/mockData";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const unreadCount = alertas.filter((a) => !a.lido).length;

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-3.5 flex items-center gap-4">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Notificações</p>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} novas</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {alertas.slice(0, 5).map((alerta) => (
                    <div
                      key={alerta.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!alerta.lido ? "bg-blue-50/50" : ""}`}
                      onClick={() => { navigate("/alertas"); setShowNotifications(false); }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${!alerta.lido ? "bg-blue-500" : "bg-gray-300"}`} />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-800 leading-snug">{alerta.mensagem}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{alerta.empresaNome} · {alerta.data}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button
                    onClick={() => { navigate("/alertas"); setShowNotifications(false); }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todos os alertas →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              MO
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">Maria Oliveira</p>
              <p className="text-xs text-gray-500 leading-tight">Administrador · TEIA</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={16} className="text-gray-400" />
                  Meu Perfil
                </button>
                <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={16} className="text-gray-400" />
                  Configurações
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="text-red-400" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
