import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider> {/* 🔥 Ahora el contexto envuelve todo */}
          <nav>
            <a href="/">Inicio</a> | <a href="/login">Login</a> | <a href="/audit">Auditoría</a> | <a href="/personal-data">Datos Personales</a> 
          </nav>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
