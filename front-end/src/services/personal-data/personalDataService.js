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

      //const response = await api.get(`personal-data/titular/${id}`, {
      const response = await api.get(`personal-data/titular/67a22e118f597b070cb5b97c`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Datos personales obtenidos:", response.data);
      return response.data;
  } catch (error) {
      console.error("❌ Error al obtener datos personales:", error);
      throw error;
  }
};

// ✅ Función para actualizar datos personales
export const updatePersonalData = async (id, updateDto) => {
  try {
    const token = getToken("accessToken");

    if (!token) {
      console.error("❌ No hay token en el almacenamiento local.");
      throw new Error("No autorizado: Token no encontrado.");
    }

    console.log("🟢 Enviando solicitud de actualización con token:", token);

    const response = await api.patch(`/personal-data/${id}`, updateDto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Datos personales actualizados:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar datos personales:", error);
    throw error;
  }
};
// 🔹 Función para obtener solicitudes ARCO (Solo Admin)
export const getARCORequests = async () => {
  try {
    const token = getToken("accessToken");

    if (!token) {
      console.error("❌ No hay token en el almacenamiento local.");
      throw new Error("No autorizado: Token no encontrado.");
    }

    console.log("🟢 Solicitando solicitudes ARCO con token:", token);

    const response = await api.get(`/personal-data/arco/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Solicitudes ARCO obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo solicitudes ARCO:", error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error("No autorizado. Verifica tu sesión.");
        case 403:
          throw new Error("Acceso denegado. No tienes permisos.");
        case 500:
          throw new Error("Error del servidor al obtener solicitudes ARCO.");
        default:
          throw new Error("Ocurrió un error desconocido.");
      }
    } else {
      throw new Error("Error de conexión. Verifica tu internet.");
    }
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

