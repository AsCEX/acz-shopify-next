import {
  fetchCustomerProfile,
  getCustomerAccessToken,
} from "@/lib/customer-account";
import type { CustomerProfile } from "@/lib/customer-account";
import Link from "next/link";

const accountLinks = [
  {
    label: "Orders",
    description: "Track purchases and view order history",
    href: "/profile",
  },
  {
    label: "Addresses",
    description: "Manage shipping and billing details",
    href: "/profile",
  },
  {
    label: "Wishlist",
    description: "Review products saved for later",
    href: "/profile",
  },
  {
    label: "Support",
    description: "Get help with orders, returns, and delivery",
    href: "/profile",
  },
];

const benefits = [
  "Faster checkout",
  "Order tracking",
  "Saved addresses",
  "Personalized deals",
];

function formatMoney(money: { amount: string; currencyCode: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitial(customer: CustomerProfile | null) {
  return (
    customer?.firstName?.charAt(0) ||
    customer?.displayName.charAt(0) ||
    "A"
  ).toUpperCase();
}

function AuthStatus({ status }: { status?: string }) {
  if (status === "missing_config") {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
        Customer Account API is not configured yet.
      </p>
    );
  }

  if (status === "signed_in") {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
        Signed in successfully.
      </p>
    );
  }

  if (status === "signed_out") {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
        Signed out.
      </p>
    );
  }

  if (status === "cancelled" || status === "invalid_state" || status === "error") {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
        Authentication could not be completed. Please try again.
      </p>
    );
  }

  return null;
}

function AccountPanel({
  customer,
  isSignedIn,
}: {
  customer: CustomerProfile | null;
  isSignedIn: boolean;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-gray-50 p-5 md:sticky md:top-4 md:self-start">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-2xl font-bold text-white">
          {getInitial(customer)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-gray-500">
            ACZ account
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950">
            {customer?.displayName || (isSignedIn ? "Your account" : "Welcome back")}
          </h1>
          <p className="mt-1 text-sm leading-5 text-gray-600">
            {customer?.emailAddress?.emailAddress ||
              (isSignedIn
                ? "Signed in. Your profile details are temporarily unavailable."
                : "Sign in to sync orders, addresses, and saved products.")}
          </p>
        </div>
      </div>

      {isSignedIn ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          <Link
            href="/api/auth/logout"
            className="flex h-12 items-center justify-center rounded-md border border-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-primary)]"
          >
            Sign out
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          <Link
            href="/api/auth/login"
            className="flex h-12 items-center justify-center rounded-md bg-[var(--color-primary)] px-5 text-sm font-bold text-white"
          >
            Sign in
          </Link>
          <Link
            href="/api/auth/login"
            className="flex h-12 items-center justify-center rounded-md border border-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-primary)]"
          >
            Create account
          </Link>
        </div>
      )}

      <div className="mt-6 border-t border-black/10 pt-5">
        <h2 className="text-sm font-bold text-gray-950">Account benefits</h2>
        <ul className="mt-3 grid gap-2">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OrdersPanel({
  customer,
  isSignedIn,
}: {
  customer: CustomerProfile | null;
  isSignedIn: boolean;
}) {
  const orders = customer?.orders.nodes ?? [];

  return (
    <div className="rounded-lg border border-black/10 bg-white p-4">
      <h2 className="text-base font-bold text-gray-950">Recent orders</h2>
      {orders.length > 0 ? (
        <div className="mt-4 divide-y divide-black/10 rounded-md border border-black/10">
          {orders.map((order) => (
            <a
              key={order.id}
              href={order.statusPageUrl}
              className="flex items-center justify-between gap-4 p-3"
            >
              <div>
                <p className="text-sm font-bold text-gray-950">{order.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(order.processedAt)}
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--color-primary)]">
                {formatMoney(order.totalPrice)}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm leading-6 text-gray-600">
          {isSignedIn
            ? "No orders yet. Your purchases will appear here after checkout."
            : "Sign in to view order history."}
        </div>
      )}
    </div>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const [{ auth }, customer, accessToken] = await Promise.all([
    searchParams,
    fetchCustomerProfile(),
    getCustomerAccessToken(),
  ]);
  const isSignedIn = Boolean(accessToken);

  return (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain bg-white pb-28">
      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-4 md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] md:px-6 md:py-8 lg:px-8">
        <AccountPanel customer={customer} isSignedIn={isSignedIn} />

        <section className="min-w-0 space-y-5">
          <AuthStatus status={auth} />

          <div className="rounded-lg border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-950">
                  Account tools
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Everything you need after checkout.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {accountLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md border border-black/10 p-4 transition hover:border-[var(--color-primary)] hover:bg-teal-50"
                >
                  <h3 className="text-sm font-bold text-gray-950">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <OrdersPanel customer={customer} isSignedIn={isSignedIn} />

          <div className="rounded-lg border border-black/10 bg-white p-4">
            <h2 className="text-base font-bold text-gray-950">Preferences</h2>
            <div className="mt-4 divide-y divide-black/10 rounded-md border border-black/10">
              <div className="flex items-center justify-between gap-4 p-3">
                <div>
                  <p className="text-sm font-bold text-gray-950">Promotions</p>
                  <p className="text-sm text-gray-600">
                    Receive sale alerts and product drops.
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                  Off
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-3">
                <div>
                  <p className="text-sm font-bold text-gray-950">
                    Order updates
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery and checkout notifications.
                  </p>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
                  On
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
