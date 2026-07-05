import "./globals.css";
import Particles from "@/components/Particles";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Particles />
        {children}
      </body>
    </html>
  );
}
