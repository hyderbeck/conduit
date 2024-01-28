"use client";

import Link from "next/link";
import Avatar from "./avatar";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftStartOnRectangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export default function Nav({
  username,
  logOut,
}: {
  username: string;
  logOut: () => Promise<void>;
}) {
  const [userMenu, setUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav>
      <ul className="flex items-center gap-x-6 relative">
        <li>
          <Link
            aria-label="new article"
            href="/new"
            className="active:shadow-inner active:shadow-stone-200 bg-stone-50 flex items-center gap-x-2"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        </li>
        <li id="menu" className="flex flex-col items-center">
          <div className="flex items-center gap-x-4">
            <Avatar username={username} width={48} priority isUser />
            <button
              onClick={() => {
                setUserMenu(!userMenu);
                document.body.addEventListener("click", (e) => {
                  if (
                    !document.getElementById("menu")?.contains(e.target as Node)
                  )
                    setUserMenu(false);
                });
              }}
              className="font-bold"
            >
              <i>@</i>
              {username}
            </button>
          </div>
          {userMenu && (
            <ul className="absolute top-20 w-full right-0 rounded px-4 py-2 *:py-2 bg-stone-50 z-10">
              <li>
                <Link href={`/${username}`} onClick={() => setUserMenu(false)}>
                  Profile
                </Link>
              </li>
              <li className="border-t border-stone-200">
                <button
                  onClick={async () => {
                    setLoggingOut(true);
                    await logOut();
                    router.replace(pathname);
                  }}
                  className="flex gap-x-2 items-center"
                >
                  <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                  {loggingOut ? "Logging out..." : "Log Out"}
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
