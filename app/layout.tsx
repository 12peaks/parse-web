import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  QueryClient,
  useQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./globals.css";
import QueryProvider from "@/libs/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parse",
  description: "Collaboration software for teams.",
};

const queryClient = new QueryClient();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
