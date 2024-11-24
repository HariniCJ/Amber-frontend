import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import "./globals.css";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "AMBER",
  description: "Real-time Ambulance Assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="p-6">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
