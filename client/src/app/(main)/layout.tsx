import Navbar from "@/lib/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="p-4 pt-20">{children}</main>
    </>
  );
}
