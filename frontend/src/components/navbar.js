import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-white text-2xl font-bold tracking-tight">
            ThoughtSpace
          </div>
          <ul className="flex space-x-8 text-white">
            <li>
              <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/signout" className="hover:opacity-80 transition-opacity">
                Signout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
