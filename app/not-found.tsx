import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1
          className="text-8xl font-black text-primary mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like this page took a detour. Let&apos;s get you back to
          exploring Columbus.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Go Home
          </Link>
          <Link
            href="/events"
            className="bg-accent text-primary px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Browse Events
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400">
          <Link href="/services" className="hover:text-primary transition">
            Services
          </Link>
          <Link href="/coupons" className="hover:text-primary transition">
            Coupons
          </Link>
          <Link href="/things-to-do" className="hover:text-primary transition">
            Things to Do
          </Link>
        </div>
      </div>
    </div>
  );
}
