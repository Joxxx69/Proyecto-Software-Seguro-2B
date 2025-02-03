import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface AuditLog {
  id: string;
  evento: string;
  entidadAfectada: string;
  entidadId: string;
  detalles: any;
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.get('/audit')
      .then((response) => setLogs(response.data))
      .catch((error) => console.error('Error al obtener auditorías', error));
  }, []);

  return (
    <div>
      <h2>Historial de Auditorías</h2>
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>Entidad Afectada</th>
            <th>Detalles</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.evento}</td>
              <td>{log.entidadAfectada}</td>
              <td>{JSON.stringify(log.detalles)}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
