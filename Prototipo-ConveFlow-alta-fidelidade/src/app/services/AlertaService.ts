import { AuthService } from "./AuthService";
import { type Alerta } from "../data/mockData";
import { ConvenioService } from "./ConvenioService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class AlertaService {
  private static getHeaders() {
    const token = AuthService.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async getAll(): Promise<Alerta[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/alertas/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar alertas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async markAsRead(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/alertas/${id}/marcar-lida`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro ao marcar alerta como lido: ${response.statusText}`);
    }
  }

  static async markAllAsRead(): Promise<void> {
    const alertas = await this.getAll();
    const unreadAlertas = alertas.filter(alerta => !alerta.lido);

    await Promise.all(
      unreadAlertas.map(alerta => this.markAsRead(alerta.id))
    );
  }

  static async createAlerta(alerta: {
    titulo: string;
    mensagem: string;
    tipo: string;
    prioridade: string;
    convenio_id?: string;
    empresa_id?: string;
  }): Promise<Alerta> {
    const response = await fetch(`${API_BASE_URL}/api/v1/alertas/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(alerta),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || `Erro ao criar alerta: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Verifica todos os convênios ativos e cria alertas automaticamente
   * para os que vencem em 7, 15 ou 30 dias, caso ainda não existam.
   */
  static async sincronizarAlertas(): Promise<void> {
    try {
      const convenios = await ConvenioService.getAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const conv of convenios) {
        if (conv.status === "encerrado") continue;

        const endDate = new Date(conv.dataTermino);
        endDate.setHours(0, 0, 0, 0);
        const days = Math.ceil(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        let tipo: Alerta["tipo"] | null = null;
        let mensagem = "";
        let prioridade: Alerta["prioridade"] = "baixa";

        if (days === 30) {
          tipo = "info";
          mensagem = `Convênio "${conv.titulo}" vence em 30 dias`;
          prioridade = "baixa";
        } else if (days === 15) {
          tipo = "warning";
          mensagem = `Convênio "${conv.titulo}" vence em 15 dias`;
          prioridade = "media";
        } else if (days === 7) {
          tipo = "warning";
          mensagem = `Convênio "${conv.titulo}" vence em 7 dias`;
          prioridade = "alta";
        } else if (days <= 0) {
          tipo = "error";
          mensagem = `Convênio "${conv.titulo}" venceu há ${Math.abs(days)} dias`;
          prioridade = "critica";
        }

        if (tipo && mensagem) {
          await this.createAlerta({
            titulo: "Vencimento de Convênio",
            mensagem,
            tipo,
            prioridade,
            convenio_id: conv.id,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar alertas:", error);
    }
  }
}
