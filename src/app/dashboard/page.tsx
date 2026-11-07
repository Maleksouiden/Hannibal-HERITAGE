export default function DashboardHomePage() {
  return (
    <main className="flex flex-col gap-4">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Overview
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base sm:leading-7">
          Admin shell for Hannibal HERITAGE. Use the sidebar to open products,
          inventory/vending, site content, and invoices/orders — each section
          will be filled in by later tickets.
        </p>
      </header>
      <ul className="mt-4 grid gap-3 text-sm text-[#5c564e] sm:grid-cols-2">
        <li className="border border-[#ddd4c5]/70 px-4 py-3">
          Products — catalog CRUD (next)
        </li>
        <li className="border border-[#ddd4c5]/70 px-4 py-3">
          Inventory / vending — stock &amp; selling flags
        </li>
        <li className="border border-[#ddd4c5]/70 px-4 py-3">
          Site content — home templates &amp; publish flags
        </li>
        <li className="border border-[#ddd4c5]/70 px-4 py-3">
          Invoices / orders — list, invoice, payment status
        </li>
      </ul>
    </main>
  );
}
