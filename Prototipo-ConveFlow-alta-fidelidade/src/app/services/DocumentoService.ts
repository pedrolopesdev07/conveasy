import { AuthService } from "./AuthService";
import { type Documento } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class DocumentoService {
  private static getHeaders() {
    const token = AuthService.getAccessToken();
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async getAll(convenioId?: string): Promise<Documento[]> {
    const url = convenioId
      ? `${API_BASE_URL}/api/v1/documentos/?convenio_id=${convenioId}`
      : `${API_BASE_URL}/api/v1/documentos/`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar documentos: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async getById(id: string): Promise<Documento | null> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documentos/${id}`, {
      headers: this.getHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar documento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async download(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documentos/${id}/download`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao fazer download: ${response.statusText}`);
    }

    // Cria um blob e força o download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'documento';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/documentos/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar documento: ${response.statusText}`);
    }
  }

  static getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileIcon(type: string): string {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('pdf')) return '📄';
    if (typeLower.includes('doc') || typeLower.includes('docx')) return '📝';
    if (typeLower.includes('xls') || typeLower.includes('xlsx')) return '📊';
    if (typeLower.includes('ppt') || typeLower.includes('pptx')) return '📈';
    if (typeLower.includes('jpg') || typeLower.includes('jpeg') || typeLower.includes('png')) return '🖼️';
    if (typeLower.includes('zip') || typeLower.includes('rar')) return '📦';
    return '📄';
  }
}