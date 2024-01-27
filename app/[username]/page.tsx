import Feed from "@/components/feed";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Profile from "./profile";
import { usernameExists } from "@/components/header";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function updateProfile(formData: FormData, currentUsername: string) {
  "use server";

  const supabase = createClient(cookies());

  const Profile = z.object({
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9]+$/)
      .optional(),
    bio: z.string().max(160).optional(),
  });

  const username = String(formData.get("username")).trim();

  if (!Profile.safeParse({ username }).success) return;

  if (
    (await usernameExists(supabase, username)) &&
    username !== currentUsername
  )
    return "Username already taken";

  const bio = (formData.get("bio") as string).trim();

  if (!Profile.safeParse({ bio }).success) return;

  const avatar = formData.get("avatar") as Blob;

  if (avatar.size) {
    if (avatar.size > 5000000) return "Avatar should be less than 5 MB";
    await supabase.storage
      .from("avatars")
      .upload(`${username}.jpg`, await avatar.arrayBuffer(), {
        contentType: "image/jpg",
        cacheControl: "60",
        upsert: true,
      });
  }

  await supabase.storage
    .from("avatars")
    .move(`${currentUsername}.jpg`, `${username}.jpg`);

  await supabase
    .schema("conduit")
    .from("profiles")
    .update({
      username,
      bio,
    })
    .eq("username", currentUsername);

  revalidatePath("/", "layout");
  return "success";
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createClient(cookies());

  const profile = (
    await supabase
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("username", params.username)
      .single()
  ).data;

  if (!profile) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <Profile
        profile={profile}
        userId={user?.id}
        updateProfile={updateProfile}
      />
      <Feed userId={user?.id} username={profile.username} />
    </main>
  );
}
