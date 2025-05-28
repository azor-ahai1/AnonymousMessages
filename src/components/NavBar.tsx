"use client"

import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="bg-gray-900 text-white shadow-md w-full" >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition-colors duration-200">
            Secret Ping
          </Link>

          {!session && <div className="hidden sm:inline-block w-4 md:w-120 lg:w-180 xl:w-250"></div>}

          {/* Right Section (Log In / Welcome) */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            {session ? (
              <>
                <div className="hidden sm:inline-block w-4 md:w-50 lg:w-75 xl:w-115"></div>
                <span className="text-sm md:text-base text-gray-300 text-center md:text-left">
                  Welcome, 
                  <Link href="/dashboard">
                      <span className="font-medium text-white">{` ${user?.userName}`}</span>
                  </Link>
                </span>
                <div className="hidden sm:inline-block w-4 md:w-50 lg:w-75 xl:w-115"></div>
                <Button
                  onClick={() => signOut()}
                  className="bg-white text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                  variant="outline"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  className="bg-white text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                  variant="outline"
                >
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
