"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-4 py-10 md:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Admin error</h2>
        <p className="text-gray-500 mb-6 text-sm">Something went wrong. Please try again.</p>
        <button onClick={reset} className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition">
          Try Again
        </button>
      </div>
    </div>
  );
}
