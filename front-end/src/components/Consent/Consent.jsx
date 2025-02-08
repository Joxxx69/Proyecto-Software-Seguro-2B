import React from "react";
import { useConsent } from "../../hooks/useConsent"; 

export const Consent = () => {
  // Se asume que el hook useConsent ahora provee las funciones approveConsent y rejectConsent
  const { consents, loading, revokeConsent, approveConsent, rejectConsent } = useConsent();

  if (loading) return <p>Cargando consentimientos...</p>;

  const handleRevoke = (consentId) => {
    // Revoca el consentimiento (actualiza el estado a REVOCADO)
    revokeConsent(consentId);
  };

  const handleApprove = (consentId) => {
    // Actualiza el estado del consentimiento a ACTIVO
    approveConsent(consentId);
  };

  const handleReject = (consentId) => {
    // Actualiza el estado del consentimiento a RECHAZADO
    rejectConsent(consentId);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Lista de Consentimientos</h2>
      {consents.length === 0 ? (
        <p>No hay consentimientos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">Titular</th>
                <th scope="col">Estado</th>
                <th scope="col">Finalidades</th>
                <th scope="col">Base Legal</th>
                <th scope="col">Fecha de Otorgamiento</th>
                <th scope="col">Fecha de Revocación</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consents.map((consent) => (
                <tr key={consent.id}>
                  <td>{consent.titularId}</td>
                  <td>{consent.estado}</td>
                  <td>{consent.finalidades.join(", ")}</td>
                  <td>{consent.baseLegal}</td>
                  <td>{new Date(consent.fechaOtorgamiento).toLocaleDateString()}</td>
                  <td>
                    {consent.fechaRevocacion
                      ? new Date(consent.fechaRevocacion).toLocaleDateString()
                      : "No revocado"}
                  </td>
                  <td>
                    {consent.estado === "PENDIENTE" && (
                      <>
                        <button
                          className="btn btn-success me-2"
                          onClick={() => handleApprove(consent.id)}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleReject(consent.id)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {consent.estado === "ACTIVO" && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRevoke(consent.id)}
                      >
                        Revocar
                      </button>
                    )}
                    {(consent.estado === "REVOCADO" ||
                      consent.estado === "RECHAZADO") && <span>No hay acciones</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
