import type { Metadata, Viewport } from "next";

// Self-hosted fonts (no runtime calls to Google). Latin subset only.
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "material-symbols/outlined.css";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Nexus Dispatch",
    template: "%s · Nexus Dispatch",
  },
  description: "Multi-tenant cold-chain logistics, telematics and dispatch platform.",
};

export const viewport: Viewport = {
  themeColor: "#213145",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
