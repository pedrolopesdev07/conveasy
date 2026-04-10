import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  FileText,
  FolderOpen,
  Bell,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Handshake,
} from "lucide-react";
import { AuthService } from "../services/AuthService";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/empresas", label: "Empresas", icon: Building2 },
  { to: "/convenios", label: "Convênios", icon: Handshake },
  { to: "/documentos", label: "Documentos", icon: FolderOpen },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/usuarios", label: "Usuários", icon: Users },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className="flex flex-col bg-[#1e3a5f] text-white transition-all duration-300 relative flex-shrink-0"
      style={{ width: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex-shrink-0 w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
          <Handshake size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">ConveFlow</p>
            <p className="text-xs text-blue-300 leading-tight truncate">Gestão de Convênios</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="text-xs text-blue-400 font-medium px-2 mb-2 uppercase tracking-wider">Menu Principal</p>
        )}
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${isActive ? "text-white" : "text-blue-300 group-hover:text-white"}`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
                {to === "/alertas" && !collapsed && (
                  <span className="ml-auto flex-shrink-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                )}
                {to === "/alertas" && collapsed && (
                  <span className="absolute left-8 top-1 bg-red-500 rounded-full w-2 h-2" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-2">
        <button
          onClick={() => {
            AuthService.logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut size={20} className="flex-shrink-0 text-blue-300" />
          {!collapsed && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm z-10 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
