import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LikeButton } from "@/components/buttons";
import Avatar from "@/components/avatar";
import Tags from "@/components/tags";

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
      <Avatar username={params.username} width={48} />
      <Link href={`/${params.username}`}>
        <address>{params.username}</address>
      </Link>
      <LikeButton articleId={article.id} userId={user?.id} />
      <p>{article.body}</p>
      {article.tag_list?.length && <Tags tags={article.tag_list} />}
    </main>
  );
}
