import { AuthService } from "./AuthService";
import { type Usuario, type UsuarioPerfil } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type UsuarioInput = {
  nome: string;
  email: string;
  perfil: UsuarioPerfil;
  setor: string;
  status: "ativo" | "inativo";
};

type ChangePasswordInput = {
  senha_atual: string;
  nova_senha: string;
};

export class UsuarioService {
  private static getHeaders() {
    const token = AuthService.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async getAll(): Promise<Usuario[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async getMe(): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/me`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do usuário: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async getById(id: string): Promise<Usuario | null> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/${id}`, {
      headers: this.getHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async save(form: UsuarioInput, id?: string): Promise<Usuario> {
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE_URL}/api/v1/usuarios/${id}`
      : `${API_BASE_URL}/api/v1/usuarios/`;

    const response = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao salvar usuário: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async updateRole(id: string, role: UsuarioPerfil): Promise<Usuario> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/${id}/role`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ perfil: role }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao atualizar perfil: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async changePassword(data: ChangePasswordInput): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/change-password`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao alterar senha: ${response.statusText}`);
    }
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar usuário: ${response.statusText}`);
    }
  }

  static async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/logout`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    // Mesmo se falhar, fazemos logout local
    AuthService.logout();

    if (!response.ok) {
      throw new Error(`Erro ao fazer logout: ${response.statusText}`);
    }
  }
}
