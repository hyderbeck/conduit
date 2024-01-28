"use client";

import {
  follow,
  like,
  unfollow,
  unlike,
  isFollowing,
  isFavorite,
} from "./actions";
import { usePathname, useRouter } from "next/navigation";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export function Button({
  onClick,
  text,
  type,
  className,
  children,
  disabled,
}: {
  onClick?: () => void | Promise<void>;
  text?: string;
  type?: "button";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => onClick && onClick()}
      className={`flex gap-x-2 items-center justify-center min-w-20 text-emerald-300 border border-emerald-300 rounded px-2 py-1 active:shadow-inner active:shadow-stone-200 bg-stone-50 ${className}`}
      type={type ? type : "submit"}
      disabled={disabled}
    >
      {children}
      {text}
    </button>
  );
}

export function FollowButton({
  followingId,
  followerId,
}: {
  followingId: string;
  followerId?: string;
}) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const [active, setActive] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!followerId) {
        setActive(false);
      } else {
        setActive((await isFollowing(followingId, followerId)) || false);
      }
    };

    checkFollowing();
  }, [followingId, followerId]);

  return (
    <Button
      type="button"
      onClick={async () => {
        if (!followerId) {
          replace(`${pathname}?login=true`);
        } else {
          if (active) {
            setActive(false);
            await unfollow(followingId, followerId);
          } else {
            setActive(true);
            await follow(followingId, followerId);
          }
        }
      }}
      className={
        active
          ? "border-stone-950 text-stone-950 shadow-inner shadow-stone-200"
          : "border-stone-950 text-stone-950"
      }
      text={active ? "Following" : "Follow"}
    />
  );
}

export function LikeButton({
  articleId,
  userId,
}: {
  articleId: number;
  userId?: string;
}) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const [active, setActive] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId) {
        setActive(false);
      } else setActive((await isFavorite(articleId, userId)) || false);
    };

    checkFavorite();
  }, [articleId, userId]);

  return (
    <Button
      type="button"
      onClick={async () => {
        if (!userId) {
          replace(`${pathname}?login=true`);
        } else {
          if (active) {
            setActive(false);
            await unlike(articleId, userId);
          } else {
            setActive(true);
            await like(articleId, userId);
          }
        }
      }}
      className={`text-red-500 bg-transparent border-none active:shadow-none !min-w-0 !w-fit !p-0`}
    >
      {active ? (
        <HeartIconSolid className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </Button>
  );
}
