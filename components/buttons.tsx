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
import clsx from "clsx";

export function Button({
  button,
  children,
  onClick,
  color,
  disabled,
  active,
  className,
}: {
  button?: boolean;
  children?: React.ReactNode;
  onClick?: () => void | Promise<void>;
  color?: "emerald" | "black";
  disabled?: boolean;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type={button ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "flex gap-x-2 items-center justify-center min-w-20 border rounded px-2 py-1 bg-stone-50 following:shadow-stone-200 active:shadow-inner active:shadow-stone-200",
        color === "emerald"
          ? "text-emerald-300 border-emerald-300"
          : "text-stone-950 border-stone-950",
        active && "shadow-inner shadow-stone-200",
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button button color="black" onClick={onClick}>
      Edit
    </Button>
  );
}

export function CancelButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <Button button color="black" onClick={onClick} disabled={loading}>
      Cancel
    </Button>
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

  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!followerId) {
        setFollowing(false);
      } else {
        setFollowing((await isFollowing(followingId, followerId)) || false);
      }
    };

    checkFollowing();
  }, [followingId, followerId]);

  return (
    <Button
      button
      onClick={async () => {
        if (!followerId) {
          replace(`${pathname}?login=true`);
        } else {
          if (following) {
            setFollowing(false);
            await unfollow(followingId, followerId);
          } else {
            setFollowing(true);
            await follow(followingId, followerId);
          }
        }
      }}
      color="black"
      active={following}
    >
      {following ? "Following" : "Follow"}
    </Button>
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

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId) {
        setFavorite(false);
      } else setFavorite((await isFavorite(articleId, userId)) || false);
    };

    checkFavorite();
  }, [articleId, userId]);

  return (
    <button
      type="button"
      aria-label="like"
      onClick={async () => {
        if (!userId) {
          replace(`${pathname}?login=true`);
        } else {
          if (favorite) {
            setFavorite(false);
            await unlike(articleId, userId);
          } else {
            setFavorite(true);
            await like(articleId, userId);
          }
        }
      }}
      className="text-red-500 w-fit"
    >
      {favorite ? (
        <HeartIconSolid className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
}
