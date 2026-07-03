import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-normal">
          ACZ
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-6 text-sm"
        >
          <Link href="/" className="hover:underline">
            Shop
          </Link>
          <Link href="/cart" className="hover:underline">
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
