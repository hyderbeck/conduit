import { Tables } from "@/types";
import Avatar from "./avatar";
import Link from "next/link";
import { LikeButton } from "./buttons";
import Tags from "./tags";

export default function Preview({
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
      {article.tag_list?.length && <Tags tags={article.tag_list} />}
    </article>
  );
}
