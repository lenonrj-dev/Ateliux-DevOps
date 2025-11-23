import "./globals.css";
import AppShell from "../components/shell/AppShell";

export const dynamic = "force-static";

export const metadata = {
  title: "Ateliux DevOps",
  description: "Painel de operações e confiabilidade da plataforma Ateliux.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#050910] text-gray-100 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
