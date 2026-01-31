import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "chambresito.com",
  description: "Plataforma de predicciones con créditos de participación"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
