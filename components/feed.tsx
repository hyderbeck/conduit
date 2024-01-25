import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { Tables } from "@/types";
import Link from "next/link";

function Article({
  article,
  author,
}: {
  article: Tables<"articles">;
  author: string;
}) {
  return (
    <article>
      <Link href={`/${author}`}>
        <address>{author}</address>
      </Link>
      <time>{article.created_at}</time>
      <button>Like</button>
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
