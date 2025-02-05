import { useState, useEffect } from 'react';
import { isTokenValid } from '../services/token/store';  // Importa la función que valida el token

// Hook reutilizable para verificar la autenticación
export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuthentication = async () => {
            setLoading(true);
            const tokenValid = await isTokenValid('accessToken');
            setIsAuthenticated(tokenValid);
            setLoading(false);
        };

        verifyAuthentication();
    }, []);

    return { loading, isAuthenticated };
};
