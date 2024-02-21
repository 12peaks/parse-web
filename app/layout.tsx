import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/libs/query-provider";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import "./globals.css";
import { Authenticated } from "./_components/auth/Authenticated";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parse",
  description: "Collaboration software for teams.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <MantineProvider defaultColorScheme="auto">
            <NavigationProgress />
            <Notifications />
            <ModalsProvider>
              <Authenticated>{children}</Authenticated>
            </ModalsProvider>
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
