import React from "react";
import { useConsent } from "../../hooks/useConsent";

export const Consent = () => {
  const { consents, loading, revokeConsent, approveConsent, rejectConsent } = useConsent();

  if (loading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center p-6">
          <svg className="animate-spin h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p>Cargando consentimientos...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      ACTIVO: "bg-green-100 text-green-800",
      REVOCADO: "bg-red-100 text-red-800",
      RECHAZADO: "bg-gray-100 text-gray-800"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Consentimientos</h2>
      </div>
      <div className="p-6">
        {consents.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-2 text-gray-600">No hay consentimientos registrados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {consents.map((consent) => (
              <div key={consent.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Titular</p>
                      <p className="mt-1">{consent.titularId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <div className="mt-1">{getStatusBadge(consent.estado)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Base Legal</p>
                      <p className="mt-1">{consent.baseLegal}</p>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="text-sm font-medium text-gray-500">Finalidades</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {consent.finalidades.map((finalidad, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {finalidad}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Otorgamiento</p>
                      <p className="mt-1">{formatDate(consent.fechaOtorgamiento)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Aprobación</p>
                      <p className="mt-1">{formatDate(consent.fechaAprobacion)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Revocación</p>
                      <p className="mt-1">{formatDate(consent.fechaRevocacion)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 justify-end">
                    {consent.estado === "PENDIENTE" && (
                      <>
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => approveConsent(consent.id)}
                        >
                          Aprobar
                        </button>
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          onClick={() => rejectConsent(consent.id)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {consent.estado === "ACTIVO" && (
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => revokeConsent(consent.id)}
                      >
                        Revocar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consent;