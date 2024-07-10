import React from "react";
import Image from "next/image";
import Social from "../Social/page";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm sm:w-[26rem] shadow sm:p-5 border dark:border-zinc-800 rounded-md">
        <div className="p-5 space-y-5">
          <div className="text-center space-y-3">
            <Image
              src={"/images/supabase.png"}
              alt="supabase logo"
              width={50}
              height={50}
              className="rounded-full mx-auto"
            />
            <h1 className="font-bold">Se connecter</h1>
          </div>
          <Social />
        </div>
      </div>
    </div>
  );
}
