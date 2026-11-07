import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e4dccf] bg-[#1c1917] text-[#e8dfd0]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            Company
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
          <p className="text-[11px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            Help
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
          <p className="text-[11px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            Store
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/sajnen" className="transition hover:text-[#f7f3ec]">
                Pottery
              </Link>
            </li>
            <li>
              <Link
                href="/olive-wood"
                className="transition hover:text-[#f7f3ec]"
              >
                Tableware
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="transition hover:text-[#f7f3ec]">
                Heritage
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#cbbfa8] uppercase">
            Artisans
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/sajnen" className="transition hover:text-[#f7f3ec]">
                Women of Sejnane
              </Link>
            </li>
            <li>
              <Link
                href="/olive-wood"
                className="transition hover:text-[#f7f3ec]"
              >
                Olive wood makers
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-5 text-[#9a9082]">
            Hannibal HERITAGE — Tunisian craft for the contemporary home.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] tracking-[0.16em] text-[#9a9082] uppercase sm:px-6">
        © {new Date().getFullYear()} Hannibal HERITAGE
      </div>
    </footer>
  );
}
