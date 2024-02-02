"use server";

import { cookies } from "next/headers";
import { createClient } from "@/supabase";
import { revalidatePath } from "next/cache";

export async function follow(following_id: string, follower_id: string) {
  await createClient(cookies()).schema("conduit").rpc("following_append", {
    following_id,
    follower_id,
  });
  revalidatePath("/", "layout");
}

export async function like(article_id: number, id: string) {
  await createClient(cookies()).schema("conduit").rpc("favorites_append", {
    article_id,
    id,
  });
  revalidatePath("/", "layout");
}

export async function getAvatar(username: string) {
  return (
    await createClient(cookies()).storage.from("avatars").list()
  ).data!.find((avatar) => avatar.name.includes(username))?.name;
}

export async function isFollowing(following_id: string, follower_id: string) {
  return (
    await createClient(cookies())
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("user_id", follower_id)
      .single()
  ).data!.following?.includes(following_id);
}

export async function isFavorite(article_id: number, id: string) {
  return (
    await createClient(cookies())
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("user_id", id)
      .single()
  ).data!.favorites?.includes(article_id);
}

export async function unfollow(following_id: string, follower_id: string) {
  await createClient(cookies()).schema("conduit").rpc("following_remove", {
    following_id,
    follower_id,
  });
  revalidatePath("/", "layout");
}

export async function unlike(article_id: number, id: string) {
  await createClient(cookies()).schema("conduit").rpc("favorites_remove", {
    article_id,
    id,
  });
  revalidatePath("/", "layout");
}
