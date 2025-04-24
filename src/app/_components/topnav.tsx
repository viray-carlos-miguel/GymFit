"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SimpleUploadButton } from "./upload-button";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-2xl font-bold hover:text-red-500 transition-colors flex items-center"
        >
          <span className="text-red-500 mr-1">GYM</span>FIT
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className="hover:text-red-500 transition-colors flex flex-col items-center group"
        >
          <span>Home</span>
          <span className="h-0.5 w-0 group-hover:w-full bg-red-500 transition-all duration-300"></span>
        </Link>

        <Link
          href="/progress"
          className="hover:text-red-500 transition-colors flex flex-col items-center group"
        >
          <span>Progress</span>
          <span className="h-0.5 w-0 group-hover:w-full bg-red-500 transition-all duration-300"></span>
        </Link>

        <Link
          href="/report"
          className="hover:text-red-500 transition-colors flex flex-col items-center group"
        >
          <span>Report</span>
          <span className="h-0.5 w-0 group-hover:w-full bg-red-500 transition-all duration-300"></span>
        </Link>

        <Link
          href="/exercises"
          className="hover:text-red-500 transition-colors flex flex-col items-center group"
        >
          <span>Exercises</span>
          <span className="h-0.5 w-0 group-hover:w-full bg-red-500 transition-all duration-300"></span>
        </Link>

        <Link
          href="/contacts"
          className="hover:text-red-500 transition-colors flex flex-col items-center group"
        >
          <span>Contact</span>
          <span className="h-0.5 w-0 group-hover:w-full bg-red-500 transition-all duration-300"></span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-10 w-10",
              }
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}