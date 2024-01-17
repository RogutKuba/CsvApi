import type { Metadata } from "next";

import "@starter/ui/styles/global.css";
import { Header } from "@starter/marketing/components/Header";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen flex flex-col">
        <main className="px-12 lg:px-24">
          <Header className="h-16 md:h-20" />
          {children}
        </main>
      </body>
    </html>
  );
}
