"use client";

  import Image from "next/image";
  import { useEffect, useState } from "react";
  import { getAvatar } from "./actions";
  import clsx from "clsx";
  
  export default function Avatar({
    username,
    width,
    priority,
    src,
    onClick,
    editing,
    error,
  }: {
    username: string;
    width: number;
    priority?: boolean;
    src?: string;
    onClick?: () => void;
    editing?: boolean;
    error?: string;
  }) {
    const [url, setUrl] = useState<string | undefined>();
  
    useEffect(() => {
      const checkAvatar = async () => {
        const avatar = await getAvatar(username);
        avatar && setUrl(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar}`);
      };
  
      checkAvatar();
    }, [username]);
  
    return (
      <>
        <Image
          src={src || (url || "/avatar.svg")}
          alt={username}
          width={width}
          height={width}
          unoptimized
          priority={priority}
          tabIndex={editing ? 0 : undefined}
          onClick={onClick}
          onKeyDown={(e) => e.key === "Enter" && editing && onClick && onClick()}
          className={clsx(
            "rounded-full aspect-square",
            width === 48 ? "w-[48px]" : "w-[200px]",
            editing && "cursor-pointer",
            error && "!border-red-500"
          )}
        />
        {error && (
          <p className="text-red-500 text-sm px-2 border border-red-500 rounded bg-white w-fit text-center">
            {error}
          </p>
        )}
      </>
    );
  }
  