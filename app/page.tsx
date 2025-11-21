"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <p>Loading Map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen w-full pb-16">
      <Map />
    </main>
  );
}
