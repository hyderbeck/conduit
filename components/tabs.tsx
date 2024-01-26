"use client";

import Link from "next/link";

export default function Tabs({
  tabs,
  username,
}: {
  tabs: string[];
  username?: string;
}) {
  return (
    <ul>
      {tabs.map((tab) => (
        <li key={tab}>
          {tab === "Home" ? (
            <Link href="/" scroll={false}>
              {tab}
            </Link>
          ) : username && tab === "Feed" ? (
            <Link href={`/${username}`} scroll={false}>
              {tab}
            </Link>
          ) : tab === "Following" ? (
            <Link href={`/?tab=${tab.toLowerCase()}`} scroll={false}>
              {tab}
            </Link>
          ) : (
            <Link href={`/?tag=${tab.toLowerCase()}`} scroll={false}>
              #{tab}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
