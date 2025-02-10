import axios from "axios";
import { getToken } from "../token/store"; // Obtener el token desde el store

const API_URL = "http://localhost:3002/api/consent"; // URL del microservicio de consentimientos

// consentService.js
export const consentService = {
    // Obtener todos los consentimientos
    getAll: async () => {
        try {
            const accessToken = getToken('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró token de acceso');
            }

            const response = await axios.get(`${API_URL}/find-all`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, 
                },
            });
            return response.data; 
        } catch (error) {
            console.error("Error al obtener consentimientos", error);
            throw error; 
        }
    },

    // Revocar un consentimiento
    revokeConsent: async (consentId) => {
        try {
            const accessToken = getToken('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró token de acceso');
            }

            const response = await axios.patch(`${API_URL}/revoke/${consentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error al revocar consentimiento", error);
            throw error;
        }
    },

    // Aprobar un consentimiento
    approveConsent: async (consentId) => {
        try {
            const accessToken = getToken('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró token de acceso');
            }

            const response = await axios.patch(`${API_URL}/aprove/${consentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error al aprobar consentimiento", error);
            throw error;
        }
    },

    // Rechazar un consentimiento
    rejectConsent: async (consentId) => {
        try {
            const accessToken = getToken('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró token de acceso');
            }

            const response = await axios.patch(`${API_URL}/reject/${consentId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error al rechazar consentimiento", error);
            throw error;
        }
    },

    updateRevokeDate: async (consentId, consentData) => {
        try {
            const accessToken = getToken('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró token de acceso');
            }

            const response = await axios.patch(`${API_URL}/update-revoke-date/${consentId}`, consentData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar consentimiento", error);
            throw error;
        }
    },

};
