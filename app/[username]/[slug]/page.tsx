import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Article from "./article";
import { updateArticle } from "@/app/actions";

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
    <Article
      article={article}
      username={params.username}
      userId={user?.id}
      updateArticle={updateArticle}
    />
  );
}
