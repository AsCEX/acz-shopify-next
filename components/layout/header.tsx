"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();

  return (
    <>
      <section className={'flex justify-center z-10 items-center text-white w-full h-[var(--announcement-height)] bg-black/70 text-[11px]'}>
        Free Shipping for $10 above
      </section>
      <header className={`relative isolate flex gap-2 sticky top-0 z-40 backdrop-blur h-[var(--header-height)] px-2 items-center ${isHomePage ? " pl-2" : ""} md:static md:bg-white`}>
          {!isHomePage && <button className="relative z-10" onClick={() => router.push("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" strokeWidth="2.5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
          </button> }
          <form action="/search" method="get" className="relative z-10 flex w-full h-8 justify-between items-center rounded-md border border-[var(--color-primary)] bg-white pl-2 xl:flex">
            <input type="search" name="q" placeholder="Search for products..." autoComplete="off" aria-label="Search products" className="w-full !border-none bg-transparent text-xs text-[#C1C1C1] outline-none placeholder:text-[#8f9297]" />

            <button type="submit" aria-label="Search" className="h-full px-4 rounded-r-sm text-white transition hover:text-[var(--color-primary)] bg-[var(--color-primary)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13Zm0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Zm5.2 9.3 4 4-1.4 1.4-4-4 1.4-1.4Z"></path>
              </svg>
            </button>
          </form>

            <button className="relative z-10 text-[var(--color-primary)] drop-shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </button>
      </header>

      <div
        id="header-overlay-portal"
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(104px+env(safe-area-inset-top,104px))]",
          !isHomePage && ' !h-[calc(72px+env(safe-area-inset-top,72px))]'
        )}
        style={{backgroundColor: '#115c56'}}
      />
    </>
  );
}
