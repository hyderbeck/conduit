import Feed from "@/components/feed";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const profile = (
    await createClient(cookies())
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("username", params.username)
      .single()
  ).data;

  if (!profile) {
    notFound();
  }

  return (
    <main>
      <h2>{profile.username}</h2>
      {profile.bio && <p>{profile.bio}</p>}
      <button>Follow</button>
      <ul>
        <li>
          <h3>Feed</h3>
        </li>
      </ul>
      <Feed />
    </main>
  );
}
