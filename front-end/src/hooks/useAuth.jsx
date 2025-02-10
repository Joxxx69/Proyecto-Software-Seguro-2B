import { useState, useEffect } from 'react';
import { getToken } from '../services/token/store';
import { verifyToken, getUserInfo } from '../services/auth/auth';

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);  // Guardamos los roles

    useEffect(() => {
        const verifyAuthentication = async () => {
            setLoading(true);
            const token = getToken('accessToken');

            if (!token) {
                console.warn("⚠️ No hay token en el almacenamiento local.");
                setIsAuthenticated(false);
                setUser(null);
                setRoles([]);
                setLoading(false);
                return;
            }

            try {
                console.log("🔍 Verificando token:", token);
                const userData = await verifyToken(token);
                console.log("✅ Usuario autenticado:", userData);

                if (!userData || !userData.id) {
                    throw new Error("El usuario autenticado no tiene un ID válido.");
                }

                // Obtener información detallada del usuario
                const fullUserData = await getUserInfo(userData.id, token);
                console.log("📌 Datos completos del usuario:", fullUserData);

                setUser(fullUserData);
                setRoles(fullUserData.roles || []);  // Guardamos los roles
                setIsAuthenticated(true);
            } catch (error) {
                console.error("❌ Error verificando autenticación:", error);
                setIsAuthenticated(false);
                setUser(null);
                setRoles([]);
            }

            setLoading(false);
        };

        verifyAuthentication();
    }, []);

    return { loading, isAuthenticated, user, roles };
};
