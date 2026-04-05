"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await forgotPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
              Check your email for a password reset link. It may take a minute
              to arrive.
            </div>
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-blue-900 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-accent font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
