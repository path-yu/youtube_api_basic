"use client";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head></head>
      <meta name="viewport" />
      <body>
        <NextUIProvider>
          <main className="dark text-foreground bg-background">{children}</main>
        </NextUIProvider>
      </body>
    </html>
  );
}
