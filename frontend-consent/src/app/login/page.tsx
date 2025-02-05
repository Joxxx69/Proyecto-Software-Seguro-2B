'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      console.log("🔍 Enviando login con:", { email, password });
      await login(email, password);
      setMessage("✅ Login exitoso! Redirigiendo...");
      console.log("🚀 Login exitoso!");
    } catch (error: any) {
      console.error("❌ Error en el login:", error.response?.data || error.message);
      setMessage("❌ Error al iniciar sesión: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <CardContent>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
            <Button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200" disabled={loading}>
              {loading ? "Cargando..." : "Ingresar"}
            </Button>
          </form>
          {message && (
            <p className={`text-sm mt-4 text-center font-medium ${message.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center mt-4 font-medium">❌ {error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
