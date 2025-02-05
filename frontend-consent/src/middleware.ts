import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value; // Obtener token desde cookies

  if (!accessToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = JSON.parse(req.cookies.get("user")?.value || "{}"); // Datos del usuario desde cookies

    // Redirigir según el rol del usuario
    if (user.role === "USER_ROLE" && req.nextUrl.pathname === "/audit") {
      return NextResponse.redirect(new URL("/personal-data", req.url));
    }

    if (user.role === "ADMIN_ROLE" && req.nextUrl.pathname === "/personal-data") {
      return NextResponse.redirect(new URL("/audit", req.url));
    }

    if (user.role === "AUDITOR_ROLE" && req.nextUrl.pathname !== "/audit") {
      return NextResponse.redirect(new URL("/audit", req.url));
    }

  } catch (error) {
    console.error("❌ Error procesando autenticación:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/personal-data", "/audit"], // 🔥 Solo protege estas rutas
};
