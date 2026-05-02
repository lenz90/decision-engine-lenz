import "./globals.css";

export const metadata = {
  title: "Decision Engine",
  description: "Toma decisiones en hasta cuatro fases con patrones LangChain.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
