"use client";

import Avatar from "@/components/avatar";
import { LikeButton } from "@/components/buttons";
import Tags from "@/components/tags";
import { Tables } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Article({
  article,
  username,
  userId,
  updateArticle,
  isNew,
}: {
  article: Tables<"articles">;
  username: string;
  userId?: string;
  updateArticle: (
    formData: FormData,
    tags: string[],
    currentSlug: string,
    userId: string,
    currentArticleId: number,
    isNew?: boolean
  ) => Promise<string | undefined | { slug: string }>;
  isNew?: boolean;
}) {
  const isUser = userId === article.author_id;
  const [isEditing, setIsEditing] = useState(isNew);
  const [tags, setTags] = useState(article.tag_list || []);
  const [error, setError] = useState("");
  const router = useRouter();

  const [body, setBody] = useState(article.body);

  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={() => {
        if (!isEditing) return;
        setError("");
        setLoading(true);
      }}
      action={async (formData) => {
        const error = await updateArticle(
          formData,
          tags,
          article.slug,
          userId!,
          article.id,
          isNew
        );
        if (typeof error === "object") {
          setError("");
          setLoading(false);
          if (!isNew && error.slug !== article.slug) {
            router.replace(`/${username}/${error.slug}`);
          } else {
            setBody(formData.get("body") as string);
            setIsEditing(false);
          }
        } else {
          error && setError(error);
          setLoading(false);
        }
      }}
    >
      <div>
        <div>
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Title"
                  aria-label="title"
                  name="title"
                  required
                  defaultValue={article.title}
                  maxLength={100}
                />
                {error === "Avatar should be less than 5 MB" && <p>{error}</p>}
              </>
            ) : (
              <h2>{article.title}</h2>
            )}
            <div>
              <Avatar username={username} width={48} />
              <div>
                <Link href={`/${username}`}>
                  <address>
                    <i>@</i>
                    {username}
                  </address>
                </Link>
                {article.created_at && (
                  <time>{new Date(article.created_at).toDateString()}</time>
                )}
              </div>
            </div>
          </div>
          <div>
            {isEditing ? (
              <>
                {isNew ? (
                  <Link href={loading ? "" : `/${username}`}>Cancel</Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              isUser && (
                <button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )
            )}
          </div>
        </div>
      </div>
      <div>
        {isEditing ? (
          <textarea
            placeholder="Body"
            aria-label="body"
            name="body"
            rows={10}
            required
            defaultValue={body}
          />
        ) : (
          <p>{body}</p>
        )}
        <div>
          {isEditing ? (
            <>
              <Tags
                tags={tags}
                onBlur={(index, newTag) => {
                  if (newTag.trim() && newTag.match(/^[a-zA-Z0-9]+$/)) {
                    tags.splice(index, 1, newTag);
                    setTags(tags);
                  } else {
                    setTags(tags.slice(0, -1));
                  }
                }}
                push={() => setTags([...tags, ""])}
                pop={() => setTags(tags.slice(0, -1))}
              />
              <button disabled={loading}>
                {isNew
                  ? loading
                    ? "Posting..."
                    : "Post"
                  : loading
                  ? "Saving..."
                  : "Save"}
              </button>
            </>
          ) : (
            <>
              {tags.length && <Tags tags={tags} />}
              <LikeButton articleId={article.id} userId={userId} />
            </>
          )}
        </div>
      </div>
    </form>
  );
}
