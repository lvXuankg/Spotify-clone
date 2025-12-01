"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUser } from "@/store/slices/auth";
import Link from "next/link";

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, requesting, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Fetch user khi component mount
    dispatch(fetchUser());
  }, [dispatch]);

  if (requesting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-8">
      <main className="w-full max-w-md rounded-lg bg-gray-900 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-2">Spotify</h1>
          <p className="text-gray-400">Web Player Clone</p>
        </div>

        {isAuthenticated && user ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-800 p-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Welcome back, {user.email}!
              </h2>
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                {/* TODO: Thêm các field user khác */}
              </div>
            </div>

            <Link
              href="/browse"
              className="block w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full text-center transition-colors"
            >
              Go to Browse
            </Link>

            {/* TODO: Thêm logout button */}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg bg-red-900/20 border border-red-500 p-4">
              <p className="text-red-300">
                {error || "You are not logged in. Please login first."}
              </p>
            </div>

            <Link
              href="/login"
              className="block w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full text-center transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
