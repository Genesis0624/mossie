import type { Metadata, Viewport } from "next";
import { Spectral, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Spectral: titulares, citas, voz editorial.
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Hanken Grotesk: navegación, datos, formularios, controles.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mossie",
    template: "%s · Mossie",
  },
  description:
    "Tu sistema personal, sereno y sin prisa. El musgo no compite, cubre.",
  applicationName: "Mossie",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mossie",
  },
};

export const viewport: Viewport = {
  themeColor: "#3f5e3a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spectral.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
