import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmpresasList from "./pages/EmpresasList";
import EmpresaCadastro from "./pages/EmpresaCadastro";
import ConveniosList from "./pages/ConveniosList";
import ConvenioCadastro from "./pages/ConvenioCadastro";
import ConvenioDetalhe from "./pages/ConvenioDetalhe";
import EmpresaDetalhe from "./pages/EmpresaDetalhe";
import Documentos from "./pages/Documentos";
import Alertas from "./pages/Alertas";
import Usuarios from "./pages/Usuarios";
import TestFirebase from "./pages/TestBD";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <RequireAuth><Dashboard /></RequireAuth> },
      { path: "empresas", element: <RequireAuth><EmpresasList /></RequireAuth> },
      { path: "empresas/nova", element: <RequireAuth><EmpresaCadastro /></RequireAuth> },
      { path: "empresas/:id", element: <RequireAuth><EmpresaDetalhe /></RequireAuth> },
      { path: "empresas/:id/editar", element: <RequireAuth><EmpresaCadastro /></RequireAuth> },
      { path: "convenios", element: <RequireAuth><ConveniosList /></RequireAuth> },
      { path: "convenios/novo", element: <RequireAuth><ConvenioCadastro /></RequireAuth> },
      { path: "convenios/:id", element: <RequireAuth><ConvenioDetalhe /></RequireAuth> },
      { path: "convenios/:id/editar", element: <RequireAuth><ConvenioCadastro /></RequireAuth> },
      { path: "documentos", element: <RequireAuth><Documentos /></RequireAuth> },
      { path: "alertas", element: <RequireAuth><Alertas /></RequireAuth> },
      { path: "usuarios", element: <RequireAuth><Usuarios /></RequireAuth> },
      { path: "teste", element: <RequireAuth><TestFirebase /></RequireAuth> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  {
  path: "/teste",
  element: <TestFirebase />
}
]);
