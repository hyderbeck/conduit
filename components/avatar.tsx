"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { hasAvatar } from "./actions";

export default function Avatar({
  username,
  width,
  src,
  onClick,
  error,
  priority,
  isEditing,
  isUser,
}: {
  username: string;
  width: number;
  src?: string;
  onClick?: () => void;
  error?: string;
  priority?: boolean;
  isEditing?: boolean;
  isUser?: boolean;
}) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${username}.jpg`;
  const [avatar, setAvatar] = useState(false);

  useEffect(() => {
    const checkAvatar = async () => {
      setAvatar(await hasAvatar(username));
    };

    checkAvatar();
  }, [username]);

  return (
    <>
      <Image
        src={src || avatar ? url : "/avatar.svg"}
        alt={username}
        width={width}
        height={width}
        className={`rounded-full aspect-square ${
          width === 48 ? "w-[48px]" : "w-[200px]"
        } ${isEditing && "cursor-pointer"} ${
          avatar &&
          error === "Avatar should be less than 5 MB" &&
          "!border-red-500"
        } ${
          avatar &&
          isUser &&
          (width === 48
            ? "border border-emerald-500"
            : "border-2 border-emerald-500")
        }`}
        tabIndex={isEditing ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) =>
          e.key === "Enter" && isEditing && onClick && onClick()
        }
        priority={priority}
        unoptimized
      />
    </>
  );
}
