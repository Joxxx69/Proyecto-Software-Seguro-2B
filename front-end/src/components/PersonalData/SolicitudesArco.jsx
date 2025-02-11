import React, { useEffect, useState } from "react";
import { getARCORequests, updateARCORequest } from "../../services/personal-data/personalDataService";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

export const SolicitudesArco = () => {
  const [arcoRequests, setArcoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener las solicitudes ARCO
  const fetchData = async () => {
    try {
      const response = await getARCORequests();
      setArcoRequests(response.data); // Extraemos solo la data
    } catch (error) {
      console.error("❌ Error obteniendo solicitudes ARCO:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de una solicitud
  const handleUpdateStatus = async (id, status) => {
    if (status === "REJECTED") {
      Swal.fire({
        title: "Rechazar Solicitud",
        input: "text",
        inputLabel: "Motivo del rechazo",
        inputPlaceholder: "Escribe el motivo...",
        showCancelButton: true,
        confirmButtonText: "Rechazar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) {
            return "Debes escribir un motivo para el rechazo.";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateARCORequest(id, { status: "REJECTED", rejectReason: result.value });
          fetchData(); // Recargar solicitudes
        }
      });
    } else {
      await updateARCORequest(id, { status: "COMPLETED" });
      fetchData(); // Recargar solicitudes
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando solicitudes...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold text-azul-marino-500 mb-4">Solicitudes ARCO</h2>

      {arcoRequests.length === 0 ? (
        <p className="text-center text-gray-500">No hay solicitudes pendientes.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Fecha Solicitud</th>
              <th className="border p-2">Fecha Respuesta</th>
              <th className="border p-2">Motivo</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {arcoRequests.map((request) => (
              <tr key={request.id} className="border-b">
                <td className="border p-2">{request.tipo}</td>
                <td className="border p-2 flex items-center">
                  {request.status === "COMPLETED" ? (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  ) : request.status === "REJECTED" ? (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  ) : (
                    <FaEdit className="text-yellow-500 mr-2" />
                  )}
                  {request.status}
                </td>
                <td className="border p-2">
                  {new Date(request.requestDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {request.replyDate ? new Date(request.replyDate).toLocaleDateString() : "Pendiente"}
                </td>
                <td className="border p-2">{request.rejectReason || "N/A"}</td>
                <td className="border p-2">
                  {request.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleUpdateStatus(request.id, "COMPLETED")}
                      >
                        Aceptar
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
