"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Nav({
  username,
  logOut,
}: {
  username: string;
  logOut: () => Promise<void>;
}) {
  const userMenu = true;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav>
      <ul>
        <li>
          <Link href="/new">New Article</Link>
        </li>
        <li>
          <button>{username}</button>
          {userMenu && (
            <ul>
              <li>
                <Link href={`/${username}`}>Profile</Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    await logOut();
                    router.replace(pathname);
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}