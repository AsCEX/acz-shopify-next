import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:bg-white md:pb-0">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-around gap-4 px-4 py-3 text-sm text-black/70 md:justify-between md:px-6 md:py-5 lg:px-8">
        <p className="hidden md:block">© {new Date().getFullYear()} ACZ</p>
        <nav
          aria-label="Footer navigation"
          className="grid w-full grid-cols-2 gap-2 text-center md:flex md:w-auto md:items-center md:gap-5"
        >
          <Link
            href="/"
            className="rounded-md px-3 py-2 font-medium hover:text-black hover:underline"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="rounded-md px-3 py-2 font-medium hover:text-black hover:underline"
          >
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}
