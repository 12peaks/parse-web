import Image from "next/image";
import { Authenticated } from "@/app/_components/Authenticated";
import Link from "next/link";

export default function Home() {
  return (
    <Authenticated>
      <div className="flex flex-col space-y-4 justify-center items-center">
        <div className="text-3xl font-bold">This is the profile page</div>
        <Link href="/">Go to home</Link>
      </div>
    </Authenticated>
  );
}
