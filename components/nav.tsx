"use client";

import Link from "next/link";

export default function Nav({ username }: { username: string }) {
  const userMenu = true;
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
                <button>Log Out</button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
