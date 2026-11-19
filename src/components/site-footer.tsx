import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e4dccf] bg-[#293126] text-[#e8dfd0]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex flex-col">
            <span className="font-serif text-xl leading-none tracking-[0.14em] text-[#f7f3ec] uppercase">
              Hannibal
            </span>
            <span className="mt-1 text-[8px] tracking-[0.42em] text-[#cbbfa8] uppercase">
              Heritage
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#c9c2b5]">
            Tunisian pottery and olive wood, shaped by skilled hands and made
            for everyday life.
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            Discover
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/" className="transition hover:text-[#f7f3ec]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="transition hover:text-[#f7f3ec]">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/sajnen" className="transition hover:text-[#f7f3ec]">
                Sejnane
              </Link>
            </li>
            <li>
              <Link
                href="/olive-wood"
                className="transition hover:text-[#f7f3ec]"
              >
                Olive wood
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            Your account
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/login" className="transition hover:text-[#f7f3ec]">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="transition hover:text-[#f7f3ec]">
                Create account
              </Link>
            </li>
            <li>
              <Link href="/panier" className="transition hover:text-[#f7f3ec]">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="transition hover:text-[#f7f3ec]">
                Checkout
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            The makers
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/sajnen" className="transition hover:text-[#f7f3ec]">
                Women of Sejnane
              </Link>
            </li>
            <li>
              <Link href="/olive-wood" className="transition hover:text-[#f7f3ec]">
                Olive wood makers
              </Link>
            </li>
          </ul>
          <p className="mt-5 max-w-xs text-xs leading-5 text-[#a9a294]">
            Discover the story and heritage behind each collection.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] tracking-[0.16em] text-[#a9a294] uppercase sm:px-8">
        © 2026 Hannibal HERITAGE
      </div>
    </footer>
  );
}
