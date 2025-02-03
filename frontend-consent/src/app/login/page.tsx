'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null); // ✅ Para mostrar mensajes de éxito/error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Limpia el mensaje antes de un nuevo intento

    try {
      console.log("🔍 Enviando login con:", { email, password }); // ✅ Verifica los datos antes del envío
      await login(email, password);
      setMessage("✅ Login exitoso! Redirigiendo...");
      console.log("🚀 Login exitoso!"); // ✅ Verifica en consola si se ejecuta
    } catch (error: any) {
      console.error("❌ Error en el login:", error.response?.data || error.message);
      setMessage("❌ Error al iniciar sesión: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>

      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "red", marginTop: "10px" }}>
          {message}
        </p>
      )}
    </div>
  );
}
