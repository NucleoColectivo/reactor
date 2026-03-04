import type { Metadata } from "next";
import { Inter, Montserrat, IBM_Plex_Mono, Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { FloatingDialogueButton } from "@/components/common/floating-dialogue-button";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

const fontHeadline = Montserrat({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "700", "900"],
});

const fontArchivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo-black",
  weight: ["400"],
});

const fontJetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    weight: ["200", "300", "400", "600", "700"],
});


export const metadata: Metadata = {
  title: "NÚCLEO REACTOR",
  description: "Sistema de activación creativa con IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontBody.variable,
          fontHeadline.variable,
          fontMono.variable,
          fontArchivoBlack.variable,
          fontJetBrainsMono.variable
        )}
      >
        <FirebaseClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingDialogueButton />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
