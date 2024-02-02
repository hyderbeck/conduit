"use client";

import Link from "next/link";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

function Tag(
  {
    tag,
    index,
    onBlur,
    colored,
  }: {
    tag: string;
    index: number;
    onBlur?: (index: number, tag: string) => void;
    colored?: boolean;
  },
  ref: ForwardedRef<HTMLLIElement>
) {
  function randomColor() {
    const colors = [
      "#f87171",
      "#fb923c",
      "#fbbf24",
      "#facc15",
      "#a3e635",
      "#4ade80",
      "#34d399",
      "#2dd4bf",
      "#22d3ee",
      "#38bdf8",
      "#60a5fa",
      "#a78bfa",
      "#c084fc",
      "#e879f9",
      "#f472b6",
      "#fb7185",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const [color, setColor] = useState("");

  useEffect(() => {
    colored && setColor(randomColor());
  }, [colored]);

  return (
    <li
      key={index}
      className={
        onBlur
          ? "border px-2 py-0.25 rounded-full text-sm border-stone-300 text-stone-400"
          : "flex"
      }
      contentEditable={!!onBlur}
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => onBlur && onBlur(index, e.currentTarget.innerText)}
      ref={onBlur ? ref : undefined}
    >
      {onBlur ? (
        tag
      ) : (
        <Link
          href={`/?tag=${tag.toLowerCase()}`}
          scroll={false}
          className={clsx(
            "border px-2 py-0.25 rounded-full text-sm",
            !color && "border-stone-200 text-stone-400"
          )}
          style={
            color
              ? {
                  borderColor: color,
                  color: color,
                }
              : {}
          }
        >
          {tag}
        </Link>
      )}
    </li>
  );
}

const FancyTag = forwardRef(Tag);

export default function Tags({
  tags,
  colored,
  onBlur,
  push,
  pop,
}: {
  tags: string[];
  colored?: boolean;
  onBlur?: (index: number, tag: string) => void;
  push?: () => void;
  pop?: () => void;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const initial = useRef(false);

  useEffect(() => {
    initial.current && itemRef.current?.focus();
  }, [tags.length, initial]);

  return (
    <ul className={`flex flex-wrap gap-0.5 ${onBlur && "gap-y-2"}`}>
      {tags.map((tag, index) => {
        return (
          <FancyTag
            key={index}
            tag={tag}
            index={index}
            onBlur={onBlur}
            colored={colored}
            ref={itemRef}
          />
        );
      })}
      {onBlur && (
        <li className="flex gap-x-1 ml-1">
          <button
            type="button"
            onClick={() => {
              push && tags.length < 6 && push();
              initial.current = true;
            }}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button type="button" onClick={pop}>
            <MinusIcon className="w-4 h-4" />
          </button>
        </li>
      )}
    </ul>
  );
}
