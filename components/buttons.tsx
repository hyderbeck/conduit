"use client";

import { useEffect, useState } from "react";
import {
  follow,
  like,
  unfollow,
  unlike,
  isFollowing,
  isFavorite,
} from "./actions";
import { usePathname, useRouter } from "next/navigation";

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
        setFollowing(await isFollowing(followingId, followerId));
      }
    };

    checkFollowing();
  }, [followingId, followerId]);

  return (
    <button
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
    >
      Follow
    </button>
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
      } else setFavorite(await isFavorite(articleId, userId));
    };

    checkFavorite();
  }, [articleId, userId]);

  return (
    <button
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
    >
      Like
    </button>
  );
}
