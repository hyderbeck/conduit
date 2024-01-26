import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { Tables } from "@/types";
import Link from "next/link";
import { LikeButton } from "./buttons";
import Avatar from "./avatar";

function Article({
  article,
  author,
  userId,
}: {
  article: Tables<"articles">;
  author: string;
  userId?: string;
}) {
  return (
    <article>
      <Avatar username={author} width={48} />
      <Link href={`/${author}`}>
        <address>{author}</address>
      </Link>
      <time>{article.created_at}</time>
      <LikeButton articleId={article.id} userId={userId} />
      <h4>{article.title}</h4>
      <p>{article.body}</p>
      <p>
        <Link href={`/${author}/${article.slug}`}>Read more...</Link>
      </p>
      {article.tag_list && (
        <ul>
          {article.tag_list?.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default async function Feed() {
  const supabase = createClient(cookies());
  const articles = (await supabase.schema("conduit").from("articles").select())
    .data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section>
      {articles?.length &&
        articles?.map(async (article) => (
          <Article
            key={article.id}
            article={article}
            author={
              (
                await supabase
                  .schema("conduit")
                  .from("profiles")
                  .select()
                  .eq("user_id", article.author_id)
                  .single()
              ).data!.username
            }
            userId={user?.id}
          />
        ))}
      <nav aria-label="pagination">
        <ul>
          <li>1</li>
        </ul>
      </nav>
    </section>
  );
}
