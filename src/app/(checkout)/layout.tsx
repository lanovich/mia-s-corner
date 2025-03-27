import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import { Footer, Header } from "@/components/shared";
import { Toaster } from "sonner";
import { metadata as rootMetadata } from "@/app/(root)/layout";

const roboto = Roboto({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Оформление заказа | Mia's Corner",
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
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
