export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-16 sm:px-6 sm:py-20">
      <section className="flex max-w-xl flex-col gap-5">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Hannibal HERITAGE
        </h1>
        <p className="text-lg leading-8 text-[#5c564e]">
          Home layout shell is ready for later templates. Catalogs for Sajnen
          and olive wood come in following stories.
        </p>
      </section>

      {/* Tall placeholder so sticky header can be verified on scroll */}
      <section
        aria-hidden
        className="mt-24 min-h-[120vh] border-t border-[#ddd4c5]/50 pt-10 text-sm text-[#8a8278]"
      >
        Scroll to confirm the brand header stays sticky.
      </section>
    </main>
  );
}
