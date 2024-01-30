import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import Preview from "./preview";
import Pagination from "./pagination";

async function getHomeFeed(
  supabase: ReturnType<typeof createClient>,
  userId?: string,
  tab?: string,
  tag?: string
) {
  if (tag)
    return (
      await supabase
        .schema("conduit")
        .from("articles")
        .select()
        .contains("tag_list", [tag])
    ).data;

  return userId && tab === "following"
    ? (
        await supabase
          .schema("conduit")
          .from("articles")
          .select()
          .in(
            "author_id",
            (
              await supabase
                .schema("conduit")
                .from("profiles")
                .select()
                .eq("user_id", userId)
                .single()
            ).data!.following || []
          )
      ).data
    : (await supabase.schema("conduit").from("articles").select()).data;
}

async function getProfileFeed(
  supabase: ReturnType<typeof createClient>,
  username: string
) {
  return (
    await supabase
      .schema("conduit")
      .from("articles")
      .select()
      .eq(
        "author_id",
        (
          await supabase
            .schema("conduit")
            .from("profiles")
            .select()
            .eq("username", username)
            .single()
        ).data!.user_id
      )
  ).data;
}

async function getAuthor(
  supabase: ReturnType<typeof createClient>,
  authorId: string
) {
  return (
    await supabase
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("user_id", authorId)
      .single()
  ).data!.username;
}

export default async function Feed({
  username,
  searchParams,
}: {
  username?: string;
  searchParams?: { tag?: string; tab?: string; page?: number };
}) {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let articles = username
    ? await getProfileFeed(supabase, username)
    : await getHomeFeed(
        supabase,
        user?.id,
        searchParams?.tab,
        searchParams?.tag
      );

  if (articles) {
    const start =
      searchParams?.page && searchParams?.page > 1
        ? searchParams?.page * 10
        : 0;
    articles = articles.slice(start, start + 10);
  }

  return (
    <>
      {!!articles?.length &&
        articles.map(async (article) => (
          <Preview
            key={article.id}
            article={article}
            author={await getAuthor(supabase, article.author_id)}
            userId={user?.id}
          />
        ))}
      <Pagination pagesTotal={Math.ceil((articles?.length || 1) / 10)} />
    </>
  );
}
