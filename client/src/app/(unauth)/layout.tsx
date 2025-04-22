export default function UnauthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center">
      <main className="mt-8 p-8 w-full max-w-[600px] bg-neutral-100 rounded-2xl shadow-2xl">
        {children}
      </main>
    </div>
  );
}
