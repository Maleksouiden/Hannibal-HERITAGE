import { AdminBackgroundTool } from "@/components/admin-background-tool";

export default function DashboardBackgroundToolPage() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Background removal
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Upload product photos and export transparent PNGs for the catalog.
          Preview uses a checkerboard so alpha is visible.
        </p>
      </header>
      <AdminBackgroundTool />
    </main>
  );
}
