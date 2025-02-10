import { useState, useEffect } from "react";
import { getPersonalData, getARCORequests, updateARCORequest } from "../services/personal-data/personalDataService";


export const usePersonalData = (userId, role) => {
  const [personalData, setPersonalData] = useState(null);
  const [arcoRequests, setArcoRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchPersonalData(userId);
      if (role === "ADMIN_ROLE") {
        fetchARCORequests();
      }
    }
  }, [userId, role]);

  const fetchPersonalData = async (id) => {
    try {
      const data = await getPersonalData(id);
      setPersonalData(data);
    } catch (error) {
      console.error("Error obteniendo datos personales", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchARCORequests = async () => {
    try {
      const data = await getARCORequests();
      setArcoRequests(data.data);
    } catch (error) {
      console.error("Error obteniendo solicitudes ARCO", error);
    }
  };

  const approveOrRejectARCO = async (id, estado) => {
    try {
      await updateARCORequest(id, estado);
      fetchARCORequests(); // Refrescar la lista
    } catch (error) {
      console.error("Error actualizando solicitud ARCO", error);
    }
  };

    // ✅ Función para actualizar datos personales
    const updateUserPersonalData = async (id, updateDto) => {
      try {
        await updatePersonalData(id, updateDto);
        fetchPersonalData(id); // Refrescar los datos después de actualizar
      } catch (error) {
        console.error("Error actualizando datos personales", error);
      }
    };

  return { personalData, arcoRequests, loading, approveOrRejectARCO, updateUserPersonalData };
};
