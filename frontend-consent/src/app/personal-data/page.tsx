import React from "react";

const data = {
  titularId: "123e4567-e89b-12d3-a456-426614174000",
  consentId: "987e6543-e21b-45c3-b789-123456789abc",
  categoria: "SALUD",
  datosGenerales: {
    nombre: "Juan Pérez",
    edad: 30,
    direccion: "Av. Siempre Viva 742",
    telefono: "0987654321",
  },
  finalidad: "Investigación médica",
  transferencias: [
    {
      destinatario: "Hospital Central",
      finalidad: "Atención médica especializada",
      baseLegal: "CONSENTIMIENTO",
    },
    {
      destinatario: "Ministerio de Salud",
      finalidad: "Estadísticas de salud pública",
      baseLegal: "INTERES_PUBLICO",
    },
  ],
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Información de datos personales</h1>
      <div className="mb-4">
        <p><strong>Consent ID:</strong> {data.consentId}</p>
        <p><strong>Categoría:</strong> {data.categoria}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Datos Generales</h2>
        <p><strong>Nombre:</strong> {data.datosGenerales.nombre}</p>
        <p><strong>Edad:</strong> {data.datosGenerales.edad}</p>
        <p><strong>Dirección:</strong> {data.datosGenerales.direccion}</p>
        <p><strong>Teléfono:</strong> {data.datosGenerales.telefono}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Finalidad</h2>
        <p>{data.finalidad}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Transferencias</h2>
        {data.transferencias.map((transferencia, index) => (
          <div key={index} className="border p-4 rounded-lg mt-2">
            <p><strong>Destinatario:</strong> {transferencia.destinatario}</p>
            <p><strong>Finalidad:</strong> {transferencia.finalidad}</p>
            <p><strong>Base Legal:</strong> {transferencia.baseLegal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
