import { User } from "@/types/user";
import { LoginCredentials, LoginResponse } from "../../types/auth";
import { apiClient } from "../client";
import { API_BASE_URL } from "@/utils/constants/end_points";

export const accountAPI = {
  async login(credentials: LoginCredentials): Promise<LoginResponse | undefined> {
  try{
      const response = await apiClient.post<LoginResponse>(
      "/accounts/login",
      credentials
    );
    // Stockage du token
    if (response.access) {
      localStorage.setItem("access_token", response.access);
      if (response.refresh) {
        localStorage.setItem("refresh_token", response.refresh);
      }
    }
    return response;
  } catch(e){
      window.location.href = "/login";
      throw e;
    }
  },

  async register(userData: User): Promise<User> {
    const response = await apiClient.post<User>("/accounts/register", userData);
    return response;
  },

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("refresh token : ", refreshToken);
      if (!refreshToken) throw new Error("No refresh token available");

      const endpoint = "/accounts/refresh";
      const url = `${API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed : ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.resfresh);
      }

      return true;
    } catch (error) {
      console.error("Resfresh token error:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await fetch("/api/accounts/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken, // Clé importante : "refresh"
          }),
        });
      }

      // Nettoyage local dans tous les cas
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      // Redirection
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Nettoyage quand même en cas d'erreur
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>("/accounts/users/me");
  },

  // Méthode utilitaire pour vérifier l'état d'authentification
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};
