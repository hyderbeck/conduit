"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pagination({ pagesTotal }: { pagesTotal: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1") - 1
  );

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1") - 1);
  }, [searchParams]);

  const params = new URLSearchParams(searchParams);

  params.delete("page");

  function updateParams(params: URLSearchParams, page: number) {
    params.delete("page");
    params.append("page", `${page + 1}`);
    return params;
  }

  return (
    <nav aria-label="pagination">
      <ul className="flex flex-wrap mt-8 text-sm">
        {Array.from({ length: pagesTotal }).map((_, page) => (
          <li key={page}>
            {page === 0 ? (
              <Link
                href={`${pathname}?${params}`}
                scroll={false}
                onClick={() => setCurrentPage(0)}
                className={
                  currentPage === 0
                    ? "flex items-center justify-center border border-stone-200 w-7 aspect-square bg-stone-50 shadow-inner shadow-stone-200"
                    : "flex items-center justify-center border border-stone-200 w-7 aspect-square bg-stone-50 active:shadow-inner active:shadow-stone-200"
                }
              >
                1
              </Link>
            ) : (
              <Link
                href={`${pathname}?${`${updateParams(params, page)}`}`}
                scroll={false}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "flex items-center justify-center border border-stone-200 w-7 aspect-square bg-stone-50 shadow-inner shadow-stone-200"
                    : "flex items-center justify-center border border-stone-200 w-7 aspect-square bg-stone-50 active:shadow-inner active:shadow-stone-200"
                }
              >
                {page + 1}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
