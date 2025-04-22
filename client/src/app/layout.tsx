import { Toaster } from "react-hot-toast";
import "./globals.css";
import UserContextProvider from "@/lib/components/user-context";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Library App",
    template: "%s | Library App",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <UserContextProvider>
          <Toaster />
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
