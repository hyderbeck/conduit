import { FollowButton } from "@/components/buttons";
import Feed from "@/components/feed";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Avatar from "@/components/avatar";

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

  const isUser = user?.id === profile.user_id;

  return (
    <main>
      <Avatar username={profile.username} width={200} />
      <h2>{profile.username}</h2>
      {profile.bio && <p>{profile.bio}</p>}
      {!isUser && (
        <FollowButton followingId={profile.user_id} followerId={user?.id} />
      )}
      <ul>
        <li>
          <h3>Feed</h3>
        </li>
      </ul>
      <Feed />
    </main>
  );
}
