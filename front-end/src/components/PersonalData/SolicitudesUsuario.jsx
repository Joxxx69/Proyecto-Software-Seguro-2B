import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePersonalData } from "../../hooks/usePersonalData";
import Swal from "sweetalert2";

export const SolicitudesUsuario = () => {
  const { user } = useAuth();
  const { arcoRequests, loading, createUserARCORequest, updateUserARCORequest } = usePersonalData(user?.id);
  const [formData, setFormData] = useState({ tipo: "", rejectReason: "" });
  const [editingId, setEditingId] = useState(null);

  if (loading) {
    return <p className="text-center mt-10">Cargando solicitudes...</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateUserARCORequest(editingId, formData);
      setEditingId(null);
    } else {
      await createUserARCORequest(formData);
    }
    setFormData({ tipo: "", rejectReason: "" });
  };

  return (
    <div className="bg-white rounded-xl flex flex-col shadow h-full p-4">
      <h1 className="montserrat-alternates text-azul-marino-500 sm:text-3xl text-2xl font-semibold">
        Mis Solicitudes ARCO
      </h1>

      {/* Formulario de Creación / Edición */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {editingId ? "Editar Solicitud" : "Crear Solicitud"}
        </h2>

        <label>Tipo de Solicitud:</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange} className="border p-2 w-full">
          <option value="">Seleccione...</option>
          <option value="ACCESO">Acceso</option>
          <option value="RECTIFICACION">Rectificación</option>
          <option value="CANCELACION">Cancelación</option>
          <option value="OPOSICION">Oposición</option>
        </select>

        <label>Razón (Opcional):</label>
        <input type="text" name="rejectReason" value={formData.rejectReason} onChange={handleChange} className="border p-2 w-full" />

        <button className="bg-green-500 text-white px-4 py-2 rounded mt-2" onClick={handleSubmit}>
          {editingId ? "Actualizar" : "Enviar"}
        </button>
      </div>

      {/* Lista de Solicitudes */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Solicitudes Enviadas</h2>
        {arcoRequests.length > 0 ? (
          arcoRequests.map((req) => (
            <div key={req.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-2">
              <p><strong>Tipo:</strong> {req.tipo}</p>
              <p><strong>Estado:</strong> {req.status}</p>
              <p><strong>Fecha de Solicitud:</strong> {new Date(req.requestDate).toLocaleDateString()}</p>
              {req.rejectReason && <p><strong>Razón:</strong> {req.rejectReason}</p>}

              {req.status === "PENDING" && (
                <button className="bg-blue-500 text-white px-3 py-1 rounded mt-2" onClick={() => {
                  setFormData({ tipo: req.tipo, rejectReason: req.rejectReason || "" });
                  setEditingId(req.id);
                }}>
                  Editar
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tienes solicitudes ARCO.</p>
        )}
      </div>
    </div>
  );
};
