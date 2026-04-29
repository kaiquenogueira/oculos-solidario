import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Óculos Solidários — Veja com o coração",
  description: "Uma plataforma editorial para doação e troca de óculos de grau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
