"use client"; // Required for client-side hooks
import { useEffect, useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollDirection("up");
      } else {
        setScrollDirection("down");
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-opacity-75 text-black border-b-2 border-black transition-transform duration-300 ${
        scrollDirection === "up" ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        backdropFilter: "blur(10px)", // Translucent blur effect
      }}
    >
      {/* Logo */}
      <div className="text-xl font-bold tracking-wide">
        <Link href="/">AMBER</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-8">
        <Link href="/" className="hover:underline tracking-wider">
          Home
        </Link>
        <Link href="/ambulance" className="hover:underline tracking-wider">
          Ambulance
        </Link>
        <Link href="/doctors" className="hover:underline tracking-wider">
          Doctors
        </Link>
        <Link href="/police" className="hover:underline tracking-wider">
          Traffic
        </Link>
      </div>

      {/* Auth Buttons */}
      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
