import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "H.O.D Meeting",
  description: "Registrasi, kuis, dan pembagian kamar H.O.D Meeting"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
