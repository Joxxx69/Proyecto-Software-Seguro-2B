import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConsent } from "../../hooks/useConsent";

export const ConsentLogs = () => {
  const { consentLogs } = useConsent(); // Supongamos que esta función obtiene los logs desde el backend
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await consentLogs();
        setLogs(logsData);
      } catch (error) {
        console.error("Error al obtener logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p className="text-center p-6">Cargando logs...</p>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate("/consentimientos")}
      >
        Volver a Consentimientos
      </button>
      <h2 className="text-2xl font-bold mb-4">Historial de Logs</h2>
      {logs.length === 0 ? (
        <p>No hay logs registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Consent ID</th>
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Acción</th>
                <th className="px-4 py-2 border">Detalles</th>
                <th className="px-4 py-2 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="px-4 py-2 border">{log.id}</td>
                  <td className="px-4 py-2 border">{log.consentId}</td>
                  <td className="px-4 py-2 border">{log.userId}</td>
                  <td className="px-4 py-2 border font-bold">{log.action}</td>
                  <td className="px-4 py-2 border">{log.details || "-"}</td>
                  <td className="px-4 py-2 border">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsentLogs;
