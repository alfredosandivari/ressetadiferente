import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resseta Diferente | Pastelería & Café",
  description: "Pastelería y café artesanal en Antofagasta. Tortas, postres, café y más en tres locales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
