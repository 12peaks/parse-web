"use client";
import { Authenticated } from "@/app/_components/auth/Authenticated";
import Link from "next/link";

export default function Home() {
  return (
    <Authenticated>
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="text-3xl font-bold">You are authenticated</div>
        <Link href="/profile">Go to profile</Link>
      </div>
    </Authenticated>
  );
}
