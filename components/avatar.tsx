import Image from "next/image";
import { hasAvatar } from "./actions";
import { useEffect, useState } from "react";

export default function Avatar({
  username,
  width,
  priority,
  src,
}: {
  username: string;
  width: number;
  priority?: boolean;
  src?: string;
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
    <Image
      src={src || (avatar ? url : "/avatar.svg")}
      alt={username}
      width={width}
      height={width}
      className={`aspect-square ${width === 48 ? "w-[48px]" : "w-[200px]"}`}
      priority={priority}
      unoptimized
    />
  );
}
