import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const article = (
    await createClient(cookies())
      .schema("conduit")
      .from("articles")
      .select()
      .eq("slug", params.slug)
      .single()
  ).data;

  if (!article) {
    notFound();
  }

  return (
    <main>
      <h2>{article.title}</h2>
      <Link href={`/${params.username}`}>
        <address>{params.username}</address>
      </Link>
      <button>Follow</button>
      <button>Like</button>
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
