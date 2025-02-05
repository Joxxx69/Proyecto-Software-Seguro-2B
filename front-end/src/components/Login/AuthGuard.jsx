import React from 'react'
import { Navigate } from 'react-router-dom'
import { BiLoaderCircle } from "react-icons/bi";
import { useAuth } from '../../hooks/useAuth';

export const AuthGuard = ({ children }) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        // Mostrar un loader mientras se verifica
        return (
            <div className="flex flex-col open-sans items-center justify-center h-screen">
                <BiLoaderCircle className="animate-spin size-28 text-azul-marino-500" />
                <p>Redirigiendo...</p>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si está autenticado, renderizar los hijos
    return children;
}

