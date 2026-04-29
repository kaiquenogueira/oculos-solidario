import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Óculos Solidários",
  description: "Uma plataforma solidária para doação e troca de óculos de grau.",
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
