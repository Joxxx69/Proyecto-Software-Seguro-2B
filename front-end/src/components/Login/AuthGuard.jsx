import React from 'react';
import { Navigate } from 'react-router-dom';
import { BiLoaderCircle } from "react-icons/bi";
import { useAuth } from '../../hooks/useAuth';

export const AuthGuard = ({ children, allowedRoles = [] }) => {
    const { loading, isAuthenticated, roles } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col open-sans items-center justify-center h-screen">
                <BiLoaderCircle className="animate-spin size-28 text-azul-marino-500" />
                <p>Redirigiendo...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si `allowedRoles` está vacío, permite acceso a todos los autenticados
    if (allowedRoles.length > 0 && !roles.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/" />;  // Redirigir al dashboard si no tiene permisos
    }

    return children;
};
