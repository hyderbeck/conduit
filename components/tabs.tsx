"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Tabs({
  tabs,
  username,
}: {
  tabs: string[];
  username?: string;
}) {
  const params = useSearchParams();
  const [current, setCurrent] = useState(
    params.get("tag") || params.get("tab") || ""
  );

  useEffect(() => {
    setCurrent(params.get("tag") || params.get("tab") || "");
  }, [params]);

  return (
    <ul className="flex gap-4 pb-4 border-b border-stone-200">
      {tabs.map((tab) => (
        <li
          key={tab}
          className={
            (["Home", "Feed"].includes(tab) && !current) ||
            tab.toLowerCase() === current ||
            tab === current
              ? "font-bold"
              : "text-stone-400"
          }
          onClick={() => setCurrent(tab)}
        >
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
