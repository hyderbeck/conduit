"use client";

import Link from "next/link";
import { ForwardedRef, forwardRef, useEffect, useRef } from "react";

function Tag(
  {
    tag,
    index,
    onBlur,
  }: {
    tag: string;
    index: number;
    onBlur?: (index: number, tag: string) => void;
  },
  ref: ForwardedRef<HTMLLIElement>
) {
  return (
    <li
      key={index}
      contentEditable={!!onBlur}
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => onBlur && onBlur(index, e.currentTarget.innerText)}
      ref={onBlur ? ref : undefined}
    >
      {onBlur ? tag : <Link href={`/?tag=${tag.toLowerCase()}`}>{tag}</Link>}
    </li>
  );
}

const FancyTag = forwardRef(Tag);

export default function Tags({
  tags,
  onBlur,
  push,
  pop,
}: {
  tags: string[];
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
            +
          </button>
          <button type="button" onClick={pop}>
            -
          </button>
        </li>
      )}
    </ul>
  );
}
