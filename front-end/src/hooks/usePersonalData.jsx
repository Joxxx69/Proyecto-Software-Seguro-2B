import { useState, useEffect } from "react";
import { getPersonalData, getARCORequests, updateARCORequest, updatePersonalData, createPersonalData, deletePersonalData, getUserARCORequests, createARCORequest } from "../services/personal-data/personalDataService";


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

  const createUserPersonalData = async (personalData) => {
    try {
      await createPersonalData(personalData);
      fetchPersonalData(personalData.titularId);
    } catch (error) {
      console.error("Error creando datos personales", error);
    }
  };

  const deleteUserPersonalData = async (id) => {
    try {
      await deletePersonalData(id);
      setPersonalData(null); // Se eliminan los datos de la vista
    } catch (error) {
      console.error("Error eliminando datos personales", error);
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
    const updateUserPersonalData = async (titular_id ,id, updateDto) => {
      try {
        await updatePersonalData(id, updateDto);
        fetchPersonalData(titular_id); // Refrescar los datos después de actualizar
      } catch (error) {
        console.error("Error actualizando datos personales", error);
      }
    };

    const fetchUserARCORequests = async () => {
      try {
        const data = await getUserARCORequests();
        setArcoRequests(data.data);
      } catch (error) {
        console.error("Error obteniendo solicitudes ARCO", error);
      } finally {
        setLoading(false);
      }
    };
  
    const createUserARCORequest = async (requestData) => {
      try {
        await createARCORequest(requestData);
        fetchUserARCORequests();
      } catch (error) {
        console.error("Error creando solicitud ARCO", error);
      }
    };
  
    const updateUserARCORequest = async (id, updateData) => {
      try {
        await updateARCORequest(id, updateData);
        fetchUserARCORequests();
      } catch (error) {
        console.error("Error actualizando solicitud ARCO", error);
      }
    };

    // ✅ Actualizar estado de una solicitud ARCO (Admin)
    const updateARCORequest = async (id, status, rejectReason = null) => {
      try {
        const token = getToken("accessToken");
        if (!token) throw new Error("No autorizado: Token no encontrado.");

        console.log(`🟢 Actualizando solicitud ARCO ${id} a estado ${status}`);

        const response = await api.patch(`/personal-data/arco/${id}`, 
          rejectReason ? { status, rejectReason } : { status }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Solicitud ARCO actualizada:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Error actualizando solicitud ARCO:", error);
        throw error;
      }
    };

    const updateARCOStatus = async (id, status, rejectReason = null) => {
        try {
          await updateARCORequest(id, status, rejectReason);
          fetchARCORequests(); // Refrescar la lista
        } catch (error) {
          console.error("Error actualizando estado de solicitud ARCO", error);
        }
      };


    return { 
      personalData, 
      arcoRequests, 
      loading, 
      approveOrRejectARCO, 
      updateUserPersonalData, 
      deleteUserPersonalData,  // 🔹 Agregado aquí
      createUserPersonalData,
      createUserARCORequest, updateUserARCORequest , updateARCORequest, updateARCOStatus // 🔹 Agregado también
    };
  
};
