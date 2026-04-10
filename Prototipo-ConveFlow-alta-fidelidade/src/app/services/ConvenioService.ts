import { AuthService } from "./AuthService";
import { type Convenio, type HistoricoItem } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type ConvenioInput = Partial<Omit<Convenio, "documentos" | "historico">> & Record<string, unknown>;

export class ConvenioService {
  private static getHeaders() {
    const token = AuthService.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async getAll(): Promise<Convenio[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/convenios/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar convênios: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async getById(id: string): Promise<Convenio | null> {
    const response = await fetch(`${API_BASE_URL}/api/v1/convenios/${id}`, {
      headers: this.getHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar convênio: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async save(form: ConvenioInput, id?: string): Promise<Convenio> {
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE_URL}/api/v1/convenios/${id}`
      : `${API_BASE_URL}/api/v1/convenios/`;

    const response = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao salvar convênio: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/convenios/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar convênio: ${response.statusText}`);
    }
  }

  static async uploadDocumento(convenioId: string, file: File): Promise<{ message: string; storage_path: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/v1/convenios/${convenioId}/documentos`, {
      method: "POST",
      headers: {
        ...(AuthService.getAccessToken() ? { Authorization: `Bearer ${AuthService.getAccessToken()}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao fazer upload: ${response.statusText}`);
    }

    return await response.json();
  }
}
