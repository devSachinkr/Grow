import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import GrowLogo from "../../../../public/GrowLogo.png";
import Link from "next/link";
import { appLink } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/golbal/ModeToggle";
import {currentUser} from "@clerk/nextjs"
interface NavigationProps {
  user?: null | User;
}
const Navigation = async({ user }: NavigationProps) => {
  const authUser=await currentUser();
 
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image src={GrowLogo} alt="Grow Logo" width={40} height={40} />
        <span className="text-xl font-bold">Grow</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-52%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8 font-bold">
          {appLink.map((l) => (
            <Link href={l.path} key={l.name} className="hover:text-yellow-400 ">
              {l.name}
            </Link>
          ))}
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link href={"/agency"} className="bg-primary text-white px-4 p-2 rounded-md hover:bg-primary/80">{authUser?"DashBoard":"Login"}</Link>
        <UserButton/>
        <ModeToggle/>
      </aside>
    </div>
  );
};

export default Navigation;
