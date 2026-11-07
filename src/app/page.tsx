export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#f7f3ec] text-[#1c1917]">
      <header className="sticky top-0 z-10 border-b border-[#ddd4c5]/30 bg-[#f7f3ec]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span className="text-sm tracking-[0.12em] uppercase text-[#6b645a]">
            Menu
          </span>
          <p className="text-center font-semibold tracking-[0.18em] uppercase">
            Hannibal HERITAGE
          </p>
          <span className="text-sm tracking-[0.12em] uppercase text-[#6b645a]">
            Cart · TND
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-6 px-6 py-20">
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Hannibal HERITAGE
        </h1>
        <p className="max-w-lg text-lg leading-8 text-[#5c564e]">
          Scaffold ready. Next.js + Prisma + MySQL. Catalogs for Sajnen and
          olive wood come next.
        </p>
        <p className="text-sm text-[#7a7368]">
          See <code className="font-mono">README.md</code> for install, MySQL,
          and Prisma commands.
        </p>
      </main>
    </div>
  );
}
