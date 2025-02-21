import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/shared";
import { Toaster } from "sonner";

const roboto = Roboto({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Mia's Corner",
  description:
    "Магазин ароматических свечей, аромадиффузоров, аромасаше, скрабов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <main className="min-h-screen">
          <Header />
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
