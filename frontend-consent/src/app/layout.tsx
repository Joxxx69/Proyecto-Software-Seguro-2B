import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // ✅ Ahora Navbar es un componente cliente

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar /> {/* ✅ Aquí ya no da error porque Navbar es client-side */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
