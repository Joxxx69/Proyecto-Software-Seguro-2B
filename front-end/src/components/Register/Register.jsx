import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth/auth";
import Swal from "sweetalert2";

export const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.name || !form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Todos los campos son obligatorios.",
        confirmButtonColor: "#16243e",
      });
      return;
    }

    setLoading(true);

    try {
      await registerUser(form.name, form.email, form.password);
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ahora puedes iniciar sesión.",
        confirmButtonColor: "#16243e",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrarse",
        text: error.message,
        confirmButtonColor: "#16243e",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Fondo con desenfoque */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url('./Background.jpg')` }}
      />

      {/* Formulario con fondo sólido y sombra */}
      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-azul-marino-500 mb-6">
          Registro de Usuario
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-azul-marino-500 hover:bg-azul-marino-700"
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <span
            className="text-azul-marino-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </span>
        </p>
      </form>
    </div>
  );
};
