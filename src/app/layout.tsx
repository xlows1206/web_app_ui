import type { Metadata } from "next";
import { Manrope, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProjectPage } from "@/contexts/ProjectPage";
import { SelectedDocProvider } from "@/contexts/SelectedDocContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import LayoutContent from "@/components/layout/LayoutContent";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  weight: ["400", "500", "700", "800", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: "ProcAgent - Workspace",
  description: "NextJS refactored UI toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${manrope.variable} ${notoSansSC.variable} font-sans bg-surface text-on-surface antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ProjectPage>
            <SelectedDocProvider>
              <SidebarProvider>
                <LayoutContent>
                  {children}
                </LayoutContent>
              </SidebarProvider>
            </SelectedDocProvider>
          </ProjectPage>
        </LanguageProvider>
      </body>
    </html>
  );
}
