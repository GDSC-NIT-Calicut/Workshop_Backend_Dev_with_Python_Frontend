import React from "react";
import Link from "next/link";
import useAuth from "@/hooks/authHook";

const Navbar = () => {
  const {username, id, loading, logout} = useAuth();
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
              {
                !loading && id ? <button href="/" onClick={logout} className="hover:opacity-80 transition-opacity">
                Signout
              </button> : <Link href="/login" className="hover:opacity-80 transition-opacity">
                Login
              </Link>
              }
            </li>
            <li>
              {username}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
