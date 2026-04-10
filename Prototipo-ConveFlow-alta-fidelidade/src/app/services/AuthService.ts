import { StorageService } from "./StorageService";

const AUTH_KEY = "conveflow_auth";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export type AuthPayload = {
  accessToken: string;
  refreshToken?: string;
  usuario?: unknown;
};

export class AuthService {
  static loginEndpoint = () => `${API_BASE_URL}/api/v1/usuarios/login`;
  static registerEndpoint = () => `${API_BASE_URL}/api/v1/usuarios/signup`;

  static isAuthenticated(): boolean {
    const auth = StorageService.get<AuthPayload>(AUTH_KEY, { accessToken: "" });
    return Boolean(auth.accessToken);
  }

  static getAccessToken(): string | null {
    const auth = StorageService.get<AuthPayload>(AUTH_KEY, { accessToken: "" });
    return auth.accessToken || null;
  }

  static async login(email: string, senha: string) {
    const response = await fetch(this.loginEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.detail || "Falha no login");
    }

    const data = await response.json();
    StorageService.set<AuthPayload>(AUTH_KEY, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      usuario: data.usuario,
    });
    return data;
  }

  static async register(nomeCompleto: string, email: string, senha: string) {
    const response = await fetch(this.registerEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_completo: nomeCompleto,
        email,
        senha,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.detail || "Falha no cadastro");
    }

    return await response.json();
  }

  static logout() {
    StorageService.remove(AUTH_KEY);
  }
}
