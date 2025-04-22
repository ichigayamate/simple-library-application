"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "./user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import Modal from "./modal";

export default function Navbar() {
  const [signOutModal, setSignOutModal] = useState(false);
  const { user, logout } = useContext(UserContext);

  const handleSignOut = async () => {
    logout();
    setSignOutModal(false);
  }

  return (
    <>
      <nav className="navbar bg-white shadow-lg">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Library
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <p>
            Signed in as <b>{user?.name}</b>
          </p>
          <button className="btn btn-sm" onClick={() => setSignOutModal(true)}>
            <FontAwesomeIcon icon={faSignOut} />
            Sign out
          </button>
        </div>
      </nav>

      <Modal
        isOpen={signOutModal}
        onClose={() => setSignOutModal(false)}
        title="Sign out?"
        description="Are you sure you want to sign out?"
        onConfirm={handleSignOut}
      />
    </>
  );
}
