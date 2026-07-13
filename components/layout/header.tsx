"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();

  return (
    <>
      <section className={'flex justify-center z-10 items-center text-white w-full h-[24px] bg-black/70 text-[11px]'}>
        Free Shipping for $10 above
      </section>
      <header className={`flex gap-2 sticky top-0 z-40 backdrop-blur p-2 ${isHomePage ? " pl-4" : ""} md:static md:bg-white`}>
          {!isHomePage && <button onClick={() => router.push("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" strokeWidth="2.5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
          </button> }
          <form action="/search" method="get" className="flex w-full h-8 justify-between items-center rounded-md border border-[var(--color-primary)] bg-white pl-2 xl:flex">
            <input type="search" name="q" placeholder="Search for products..." autoComplete="off" aria-label="Search products" className="w-full !border-none bg-transparent text-xs text-[#C1C1C1] outline-none placeholder:text-[#8f9297]" />

            <button type="submit" aria-label="Search" className="h-full px-4 rounded-r-sm text-white transition hover:text-[var(--color-primary)] bg-[var(--color-primary)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13Zm0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Zm5.2 9.3 4 4-1.4 1.4-4-4 1.4-1.4Z"></path>
              </svg>
            </button>
          </form>

            <button type="submit" aria-label="Search" className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
      </header>

    </>
  );
}
