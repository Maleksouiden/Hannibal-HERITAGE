import { AdminBackgroundTool } from "@/components/admin-background-tool";

export default function DashboardBackgroundToolPage() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="text-[11px] tracking-[0.16em] text-[#8a8278] uppercase">
          Outils
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Fond transparent
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Uploadez une ou plusieurs images, prévisualisez sur damier, puis
          téléchargez des PNG avec fond transparent pour le catalogue.
        </p>
      </header>
      <AdminBackgroundTool />
    </main>
  );
}
