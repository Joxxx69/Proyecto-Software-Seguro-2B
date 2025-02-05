"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link href="/">Inicio</Link>
        {user?.role === "USER_ROLE" && (
          <>
            <Link href="/personal-data" className="ml-4">Datos Personales</Link>
            <Link href="/settings" className="ml-4">Configuración</Link>
          </>
        )}
        {user?.role === "ADMIN_ROLE" && <Link href="/audit" className="ml-4">Auditoría</Link>}
        {user?.role === "AUDITOR_ROLE" && <Link href="/audit" className="ml-4">Logs</Link>}
      </div>
      {user && (
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Cerrar sesión</button>
      )}
    </nav>
  );
}
