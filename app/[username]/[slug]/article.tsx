"use client";

import Avatar from "@/components/avatar";
import { Button, LikeButton } from "@/components/buttons";
import Tags from "@/components/tags";
import { Tables } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/spinner";

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
      <div className="min-h-80 bg-emerald-300 bg-hero flex items-center">
        <div className="flex-1 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8 max-w-screen-lg mx-auto">
          <div className="flex-1 flex flex-col gap-y-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Title"
                  aria-label="title"
                  name="title"
                  required
                  defaultValue={article.title}
                  spellCheck={false}
                  maxLength={100}
                  className={`text-xl sm:text-2xl px-2 border border-stone-100 rounded placeholder:text-stone-400 font-black w-full max-w-sm ${
                    error && "border border-red-500"
                  }`}
                />
                {error === "Avatar should be less than 5 MB" && (
                  <p className="text-red-500 text-sm px-2 border border-red-500 rounded bg-white w-fit text-center">
                    {error}
                  </p>
                )}
              </>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-black text-stone-50 bg-stone-950 px-1 w-fit">
                {article.title}
              </h2>
            )}
            <div className="flex gap-x-2 items-center px-4 py-2 rounded bg-stone-50 w-fit">
              <Avatar username={username} width={48} isUser={isUser} />
              <div className="flex flex-col">
                <Link href={`/${username}`}>
                  <address className="inline font-bold not-italic">
                    <i>@</i>
                    {username}
                  </address>
                </Link>
                {article.created_at && (
                  <time className="text-sm text-stone-400">
                    {new Date(article.created_at).toDateString()}
                  </time>
                )}
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 ml-auto">
            {isEditing ? (
              <>
                {isNew ? (
                  <Link
                    href={loading ? "" : `/${username}`}
                    className="flex gap-x-2 items-center justify-center min-w-20 border rounded px-2 py-1 active:shadow-inner active:shadow-stone-200 bg-stone-50 border-stone-950 text-stone-950"
                  >
                    Cancel
                  </Link>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    text="Cancel"
                    disabled={loading}
                    className="border-stone-950 text-stone-950"
                  />
                )}
              </>
            ) : (
              isUser && (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  text="Edit"
                  className="border-stone-950 text-stone-950"
                />
              )
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col max-w-screen-lg mx-auto gap-y-6">
        {isEditing ? (
          <textarea
            placeholder="Body"
            aria-label="body"
            name="body"
            rows={10}
            required
            defaultValue={body}
            spellCheck={false}
            className={`border border-stone-100 rounded placeholder:text-stone-400 resize-y px-8 py-6 bg-white text-sm sm:text-base`}
          />
        ) : (
          <p
            className={`p-6 bg-white text-sm text-stone-700 sm:text-base rounded break-words whitespace-pre-line`}
          >
            {body}
          </p>
        )}
        <div
          className={`flex items-center justify-between px-2 ${
            isEditing && "flex-col !items-start gap-y-4"
          }`}
        >
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
              <Button
                text={
                  isNew
                    ? loading
                      ? "Posting..."
                      : "Post"
                    : loading
                    ? "Saving..."
                    : "Save"
                }
                className="border-stone-950 text-stone-950 self-end"
                disabled={loading}
              >
                {loading && <Spinner />}
              </Button>
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
