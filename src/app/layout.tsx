import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import SiteFooter from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Velocy Cloud",
  description: "Облачные решения для вашего проекта",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
