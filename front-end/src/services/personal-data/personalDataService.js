import api from "../api";
import { getToken } from "../token/store";
import axios from "axios";

// Obtener datos personales del usuario autenticado
export const getPersonalData = async (id) => {
  try {
      const token = getToken("accessToken");

      if (!token) {
          console.error("❌ No hay token en el almacenamiento local.");
          throw new Error("No autorizado: Token no encontrado.");
      }

      console.log("🟢 Enviando solicitud a Personal Data con token:", token);

      const response = await api.get(`personal-data/titular/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Datos personales obtenidos:", response.data);
      return response.data;
  } catch (error) {
      console.error("❌ Error al obtener datos personales:", error);
      throw error;
  }
};

// Obtener solicitudes ARCO si el usuario es admin
export const getARCORequests = async () => {
  try {
    const response = await api.get(`/personal-data/user/requests`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo solicitudes ARCO", error);
    throw error;
  }
};

// Actualizar estado de una solicitud ARCO (aprobación o rechazo)
export const updateARCORequest = async (id, estado) => {
  try {
    const response = await api.patch(`/personal-data/AR/${id}`, { estado });
    return response.data;
  } catch (error) {
    console.error("Error actualizando solicitud ARCO", error);
    throw error;
  }
};

