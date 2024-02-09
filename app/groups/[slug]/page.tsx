import { Authenticated } from "@/app/_components/auth/Authenticated";
import { SignOutButton } from "@/app/_components/auth/SignOutButton";
import Link from "next/link";

export default function Notifications({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Authenticated>
      <div className="flex flex-col space-y-4 justify-center items-center">
        <div className="text-3xl font-bold">
          This is the {params.slug} group page.
        </div>
        <Link href="/">Go to home</Link>
        <SignOutButton />
      </div>
    </Authenticated>
  );
}
