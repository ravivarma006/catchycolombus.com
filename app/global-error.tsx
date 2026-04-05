"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1A1A2E",
                marginBottom: "0.75rem",
              }}
            >
              Something went wrong
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: "#0F4C5C",
                color: "#fff",
                padding: "0.625rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
