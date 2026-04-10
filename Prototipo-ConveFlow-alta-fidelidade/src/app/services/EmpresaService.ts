import { AuthService } from "./AuthService";
import { type Empresa } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type EmpresaInput = Partial<Empresa> & Record<string, unknown>;

type CepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export class EmpresaService {
  private static getHeaders() {
    const token = AuthService.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async getAll(): Promise<Empresa[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/empresas/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar empresas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async getById(id: string): Promise<Empresa | null> {
    const response = await fetch(`${API_BASE_URL}/api/v1/empresas/${id}`, {
      headers: this.getHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar empresa: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async save(form: EmpresaInput, id?: string): Promise<Empresa> {
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE_URL}/api/v1/empresas/${id}`
      : `${API_BASE_URL}/api/v1/empresas/`;

    const response = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao salvar empresa: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/empresas/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar empresa: ${response.statusText}`);
    }
  }

  static async consultarCEP(cep: string): Promise<CepResponse> {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error("Erro ao consultar CEP");
    }
    return await response.json();
  }
}
