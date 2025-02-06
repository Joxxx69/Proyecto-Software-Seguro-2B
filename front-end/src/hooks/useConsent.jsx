import { useState, useEffect } from "react";
import { consentService } from "../services/consent/consentService";
import { useAuth } from "./useAuth";

export function useConsent() {
    const [consents, setConsents] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const { isAuthenticated } = useAuth(); 

    useEffect(() => {
        async function fetchConsents() {
            try {
                setLoading(true); 
                const data = await consentService.getAll();
                setConsents(data); 
            } catch (error) {
                console.error("Error al obtener los consentimientos", error);
            } finally {
                setLoading(false); 
            }
        }

        if (isAuthenticated) {
            fetchConsents(); 
        } else {
            setLoading(false); 
        }
    }, [isAuthenticated]); 

    const revokeConsent = async (consentId) => {
      try {
          // Llamar a la API para revocar el consentimiento
          const updatedConsent = await consentService.revokeConsent(consentId);

          // Actualizar el estado local para reflejar la revocación
          setConsents((prevConsents) =>
              prevConsents.map((consent) =>
                  consent.id === consentId
                      ? { ...consent, estado: "REVOCADO", fechaRevocacion: new Date() }
                      : consent
              )
          );
      } catch (error) {
          console.error("Error al revocar el consentimiento", error);
      }
  };

  return { consents, loading, revokeConsent };
}
