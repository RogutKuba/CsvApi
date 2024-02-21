"use client";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-gray-500 max-w-md mt-4">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/">Go back home</Link>
    </div>
  );
}
