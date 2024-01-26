"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ pagesTotal }: { pagesTotal: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  params.delete("page");

  function updateParams(params: URLSearchParams, page: number) {
    params.delete("page");
    params.append("page", `${page + 1}`);
    return params;
  }

  return (
    <nav aria-label="pagination">
      <ul>
        {Array.from({ length: pagesTotal }).map((_, page) => (
          <li key={page}>
            {page === 0 ? (
              <Link href={`${pathname}?${params}`}>1</Link>
            ) : (
              <Link href={`${pathname}?${updateParams(params, page)}`}>
                {page + 1}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
