import "./globals.css";
import Particles from "@/components/Particles";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Particles />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
