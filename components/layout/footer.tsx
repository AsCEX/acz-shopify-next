"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {

  const pathname = usePathname();

  const isActive = (path: string = "") => {
    return pathname === path;
    }

  return (
    <footer className="fixed inset-x-0 bottom-0 z-100 border-t border-black/10 bg-white/95 backdrop-blur md:static md:bg-white md:pb-0">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-around gap-4 px-4 py-3 text-sm text-black/70 md:justify-between md:px-6 md:py-5 lg:px-8">
        <p className="hidden md:block">© {new Date().getFullYear()} ACZ</p>
        <nav
          aria-label="Footer navigation"
          className="flex justify-between w-full gap-2 text-center md:flex md:w-auto md:items-center md:gap-5"
        >
          <Link
            href="/"
            className={`flex flex-col gap-2 rounded-md px-3 py-0 text-xs font-medium hover:text-black hover:underline ${isActive("/") ? "text-[var(--color-primary)]" : ""}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-6 w-6 fill-current md:mx-0">
                <path fillRule="evenodd" d="M3 10.7 12 3l9 7.7v9.8a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.8Z" clipRule="evenodd" />
              </svg>
            Home
          </Link>

          <Link
            href="/shop"
            className={`flex flex-col gap-2 rounded-md px-3 py-0 text-xs font-medium hover:text-black hover:underline ${isActive("/shop") ? "text-[var(--color-primary)]" : ""}`}  
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-6 w-6 fill-current md:mx-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            Shop
          </Link>
          <Link
            href="/sale"
            className={`flex flex-col gap-2 rounded-md px-3 py-0 text-xs font-medium hover:text-black hover:underline ${isActive("/sale") ? "text-[var(--color-primary)]" : ""}`}
          >
            {isActive("/sale") ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mx-auto h-6 w-6 fill-current md:mx-0"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-6 w-6 fill-current md:mx-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            )}


            Sale
          </Link>
          <Link
            href="/cart"
            className={`flex flex-col gap-2 rounded-md px-3 py-0 text-xs font-medium hover:text-black hover:underline ${isActive("/cart") ? "text-[var(--color-primary)]" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto h-6 w-6 fill-current md:mx-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>

            Cart
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col gap-2 rounded-md px-3 py-0 text-xs font-medium hover:text-black hover:underline ${isActive("/profile") ? "text-[var(--color-primary)]" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mx-auto h-6 w-6 fill-current md:mx-0"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>

            Profile
          </Link>
        </nav>
      </div>
    </footer>
  );
}
