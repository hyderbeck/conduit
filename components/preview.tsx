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
  const isUser = userId === article.author_id;

  const bodyPreview = article.body.split("\n")[0];

  return (
    <article className="flex flex-col first-of-type:pt-8 py-4 last-of-type:pb-0 border-b last-of-type:border-b-0 gap-4">
      <div className="flex justify-between">
        <div className="flex gap-x-2 items-center">
          <Avatar username={author} width={48} isUser={isUser} />
          <div className="flex flex-col">
            <Link href={`/${author}`}>
              <address className="inline font-bold not-italic">
                <i>@</i>
                {author}
              </address>
            </Link>
            <time className="text-sm text-stone-400">
              {new Date(article.created_at).toDateString()}
            </time>
          </div>
        </div>
        <LikeButton articleId={article.id} userId={userId} />
      </div>
      <div>
        <h4 className="font-bold text-lg">{article.title}</h4>
        <p className="text-stone-400 text-sm">{bodyPreview}</p>
      </div>
      <div className="flex justify-between items-center">
        <Link
          href={`/${author}/${article.slug}`}
          className="text-sm text-stone-400"
        >
          Read more...
        </Link>
        {article.tag_list?.length && <Tags tags={article.tag_list} />}
      </div>
    </article>
  );
}
