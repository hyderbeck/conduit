import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowButton, LikeButton } from "@/components/buttons";

export default async function Page({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const supabase = createClient(cookies());

  const article = (
    await supabase
      .schema("conduit")
      .from("articles")
      .select()
      .eq("slug", params.slug)
      .single()
  ).data;

  if (!article) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h2>{article.title}</h2>
      <Link href={`/${params.username}`}>
        <address>{params.username}</address>
      </Link>
      <FollowButton followingId={article.author_id} followerId={user?.id} />
      <LikeButton articleId={article.id} userId={user?.id} />
      <p>{article.body}</p>
      {article.tag_list && (
        <ul>
          {article.tag_list?.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
