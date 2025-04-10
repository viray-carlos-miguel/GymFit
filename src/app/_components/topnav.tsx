"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SimpleUploadButton } from "./upload-button";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold shadow-sm bg-black text-white">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
          Pet Gallery
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          Gallery
        </Link>
        <Link href="/contacts" className="hover:text-blue-400 transition-colors">
          Contacts
        </Link>
        <Link href="/about" className="hover:text-blue-400 transition-colors">
          About
        </Link>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SimpleUploadButton />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
