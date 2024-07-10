"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithOAuth } from "@/lib/serverActions/authActions";

export default function Social() {
  return (
    <div className="w-full flex gap-2">
      <Button
        className="w-full h-8 flex items-center gap-2"
        variant="outline"
        onClick={() => signInWithOAuth("google")}
      >
        <FcGoogle />
        Google
      </Button>
    </div>
  );
}
