import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../services/token/store";
import { signIn } from "../../services/auth/auth";
import { useAuth } from "../../hooks/useAuth";
import { validateSignIn } from "../../services/auth/validateAuthForm";
import { BiLoaderCircle } from "react-icons/bi";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const navigate = useNavigate();

  const { loading, isAuthenticated } = useAuth(); // Usa el hook personalizado

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors(validateSignIn(email, password));

    if (errors.length > 0) {
        Swal.fire({
            title: "Formato incorrecto",
            text: errors[0],
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16243e",
        });
        return;
    }

    setErrors([]);
    setLoadingLogin(true);

    try {
        const { accessToken } = await signIn(email, password);
        const decodedToken = jwtDecode(accessToken);

        // Guardar el token sin importar el rol
        saveToken("accessToken", accessToken);

        console.log("✅ Usuario autenticado:", decodedToken);

        // Redirigir al dashboard general
        window.location.href = "/";

    } catch (error) {
        console.error("Error durante el inicio de sesión:", error.message);

        // Mostrar error con SweetAlert
        Swal.fire({
            icon: "error",
            title: "Error al iniciar sesión",
            text: error.message,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#16243e",
        });
    } finally {
        setLoadingLogin(false);
    }
};


  if (loading) {
    // Mostrar un loader mientras se verifica
    return (
      <div className="flex flex-col open-sans items-center justify-center h-screen">
        <BiLoaderCircle className="animate-spin size-28 text-azul-marino-500" />
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('./Background.jpg')` }}
      />

      {/* Contenedor para el formulario de login */}
      <div className="xl:w-1/2 lg:w-2/3 w-full ml-auto h-full flex items-center justify-center backdrop-blur-sm bg-white/20">
        <div className="lg:w-3/4 md:w-2/3 w-[90%] p-8 bg-white/80 rounded-lg shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="./Logo.png" alt="Logo" className="h-16" />
          </div>

          {/* Título */}
          <h2 className="text-3xl font-semibold text-azul-marino-500 mb-6 text-center">
            Iniciar sesión
          </h2>

          {/* Formulario */}
          <form onSubmit={handleLogin} autoComplete="off">
            <Grid
              container
              spacing={1}
              sx={{
                "& .MuiFormLabel-root": {
                  fontFamily: "Open Sans",
                },
              }}>
              {/* Campo de correo electrónico */}
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  sx={{
                    fontSize: window.innerWidth < 640 ? "0.875rem" : "1rem",
                  }}
                  htmlFor="outlined-adornment-email">
                  Correo Electrónico
                </InputLabel>
                <OutlinedInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="outlined-adornment-email"
                  label="Correo Electrónico"
                  autoComplete="off"
                />
              </FormControl>

              {/* Campo de contraseña */}
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  sx={{
                    fontSize: window.innerWidth < 640 ? "0.875rem" : "1rem",
                  }}
                  htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        edge="end">
                        {showPassword ? <TbEyeClosed /> : <TbEye />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                  autoComplete="off"
                />
              </FormControl>
            </Grid>
            {/* Recuérdame y Olvidó la contraseña */}
            <div className="flex items-center justify-between my-4">
              <a
                href="/recuperar-contrasena"
                className="text-sm text-azul-marino-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de inicio de sesión */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-azul-marino-500 hover:bg-azul-marino-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loadingLogin}>
                {loadingLogin ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
