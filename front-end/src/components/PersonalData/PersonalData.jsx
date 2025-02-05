import React from "react";

export const PersonalData = () => {
  return (
    <div className="bg-white rounded-xl flex flex-col shadow h-full p-4">
      <h1 className="montserrat-alternates text-azul-marino-500 sm:text-3xl text-2xl font-semibold">
        Datos Personales
      </h1>
      <p className="text-stone-600 mt-2">
        Aquí puedes gestionar la información personal de los usuarios.
      </p>
    </div>
  );
};
