import { Authenticated } from "@/app/_components/auth/Authenticated";
import { SignOutButton } from "@/app/_components/auth/SignOutButton";
import Link from "next/link";

export default function Team() {
  return (
    <Authenticated>
      <div className="flex flex-col space-y-4 justify-center items-center">
        <div className="text-3xl font-bold">This is the team page</div>
        <Link href="/">Go to home</Link>
        <SignOutButton />
      </div>
    </Authenticated>
  );
}
