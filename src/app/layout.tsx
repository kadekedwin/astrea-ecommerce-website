import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "Mochae Commerce",
  description: "E-commerce platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 py-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
