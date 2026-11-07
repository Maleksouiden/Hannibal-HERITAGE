export function CatalogRouteFallback() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-16 sm:px-6"
      aria-hidden
    >
      <div className="h-10 w-48 animate-pulse rounded-sm bg-[#ebe4d8]" />
      <div className="h-4 w-full max-w-md animate-pulse rounded-sm bg-[#ebe4d8]/80" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-2xl bg-[#ebe4d8]"
          />
        ))}
      </div>
    </div>
  );
}

export function ProductRouteFallback() {
  return (
    <div
      className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2"
      aria-hidden
    >
      <div className="aspect-[4/5] animate-pulse rounded-2xl bg-[#ebe4d8]" />
      <div className="flex flex-col gap-4 pt-4">
        <div className="h-8 w-2/3 animate-pulse rounded-sm bg-[#ebe4d8]" />
        <div className="h-4 w-24 animate-pulse rounded-sm bg-[#ebe4d8]/80" />
        <div className="h-20 w-full animate-pulse rounded-sm bg-[#ebe4d8]/70" />
      </div>
    </div>
  );
}
