import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import db from "@/lib/supabase/db";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import AppStateProvider from "@/lib/providers/state-provider";

import { cn } from "@/lib/utils";
import { SocketProvider } from "@/lib/providers/socket-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collaborative AI-Powered Workspace | CO-LAB AI",
  description:
    "Experience the future of collaboration with our cutting-edge AI-powered workspace software. Elevate productivity, streamline workflows, and unlock new possibilities for your team. Unleash the power of advanced features seamlessly integrated into a user-friendly platform. Your workspace, redefined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log(db);
  return (
    <html lang="en">
      <body className={cn("bg-background", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="co-lab-ai-theme"
        >
          <AppStateProvider>
            <SupabaseUserProvider>
              <SocketProvider>
                {children}
                <Toaster />
              </SocketProvider>
            </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
