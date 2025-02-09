import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { PageNotFound } from "./components/PageNotFound/PageNotFound";
import { Login } from "./components/Login/Login";
import { LayoutWithSidebar } from "./components/LayoutWithSideBar";
import { RecuperarContrasena } from "./components/RecuperarContrasena/RecuperarContrasena";
import { AuthGuard } from "./components/Login/AuthGuard";
import PersonalData from "./components/PersonalData/PersonalData";
import { Consent } from "./components/Consent/Consent";
import { Transparency } from "./components/Transparency/Transparency";
import Audit from "./components/Audit/Audit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="*" element={<PageNotFound />} />

        <Route
          path="/*"
          element={
            <AuthGuard>
              <LayoutWithSidebar />
            </AuthGuard>
          }>
          <Route path="" element={<Dashboard />} />
          
          {/* ✅ Rutas accesibles para TODOS los usuarios autenticados */}
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="consent" element={<Consent />} />
          <Route path="transparency" element={<Transparency />} />

          {/* ✅ Ruta exclusiva para ADMIN_ROLE */}
          <Route
            path="audit"
            element={
              <AuthGuard allowedRoles={["ADMIN_ROLE"]}>
                <Audit />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
