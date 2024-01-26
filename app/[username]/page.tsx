import Feed from "@/components/feed";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Profile from "./profile";

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
      <Profile profile={profile} userId={user?.id} />
      <Feed userId={user?.id} username={profile.username} />
    </main>
  );
}
