import React from "react";
import { useConsent } from "../../hooks/useConsent"; 

export const Consent = () => {
    const { consents, loading, revokeConsent } = useConsent();  // Supongo que "revokeConsent" es una función que se encarga de revocar el consentimiento

    if (loading) return <p>Cargando consentimientos...</p>;

    const handleRevoke = (consentId) => {
        // Llamar a la función para revocar el consentimiento, pasando el ID del consentimiento
        revokeConsent(consentId);
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
                                <th scope="col">Método de Obtención</th>
                                <th scope="col">Fecha de Otorgamiento</th>
                                <th scope="col">Fecha de Revocación</th>
                                <th scope="col">Acciones</th> {/* Columna para el botón de revocar */}
                            </tr>
                        </thead>
                        <tbody>
                            {consents.map((consent) => (
                                <tr key={consent.id}>
                                    <td>{consent.titularId}</td>
                                    <td>{consent.estado}</td>
                                    <td>{consent.finalidades.join(", ")}</td>
                                    <td>{consent.baseLegal}</td>
                                    <td>{consent.metodoObtencion}</td>
                                    <td>{new Date(consent.fechaOtorgamiento).toLocaleDateString()}</td>
                                    <td>{consent.fechaRevocacion ? new Date(consent.fechaRevocacion).toLocaleDateString() : "No revocado"}</td>
                                    <td>
                                        {consent.estado !== "REVOCADO" && (
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => handleRevoke(consent.id)}>
                                                Revocar
                                            </button>
                                        )}
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
