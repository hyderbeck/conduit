"use client";

import Avatar from "@/components/avatar";
import { Button, CancelButton, LikeButton } from "@/components/buttons";
import Tags from "@/components/tags";
import { Tables } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/spinner";
import { Body, Title } from "@/components/inputs";
import clsx from "clsx";

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

  const [body, setBody] = useState(article.body);
  const [editing, setEditing] = useState(isNew);
  const [tags, setTags] = useState(article.tag_list || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  return (
    <form
      onSubmit={() => {
        if (!editing) return;
        setError("");
        setLoading(true);
      }}
      action={async (formData) => {
        const message = await updateArticle(
          formData,
          tags,
          article.slug,
          userId!,
          article.id,
          isNew
        );
        if (
          message &&
          message !== "You can't have two articles with the same title"
        ) {
          setError("");
          setLoading(false);
          if (isNew || (message && message !== article.slug)) {
            router.replace(`/${username}/${message}`);
          } else {
            setBody(formData.get("body") as string);
            setEditing(false);
          }
        } else {
          message && setError(message);
          setLoading(false);
        }
      }}
    >
      <div className="min-h-80 bg-emerald-300 bg-hero flex items-center">
        <div className="flex-1 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8 max-w-screen-lg mx-auto">
          <div className={clsx("flex-1 flex", !isUser && "sm:justify-center")}>
            <div className="flex flex-col gap-y-2">
              {editing ? (
                <Title
                  title={article.title}
                  error={
                    error === "You can't have two articles with the same title"
                      ? error
                      : undefined
                  }
                  className="text-2xl md:text-3xl px-2 font-black w-full max-w-sm md:max-w-md"
                  errorClassName="px-2 border border-red-500 rounded bg-white w-fit text-center"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl font-black bg-stone-950 text-stone-50 rounded px-2 py-1 w-fit">
                  {article.title}
                </h2>
              )}
              <div className="flex gap-x-2 items-center px-4 py-2 rounded bg-stone-50 w-fit">
                <Avatar username={username} width={48} />
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
          </div>
          <div className="flex sm:flex-col gap-2 ml-auto">
            {editing ? (
              <>
                {isNew ? (
                  <Link
                    href={loading ? "" : `/${username}`}
                    className="flex gap-x-2 items-center justify-center min-w-20 border rounded px-2 py-1 active:shadow-inner active:shadow-stone-200 bg-stone-50 border-stone-950 text-stone-950"
                  >
                    Cancel
                  </Link>
                ) : (
                  <CancelButton
                    onClick={() => setEditing(false)}
                    loading={loading}
                  />
                )}
              </>
            ) : (
              isUser && (
                <Button button onClick={() => setEditing(true)} color="black">
                  Edit
                </Button>
              )
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col max-w-screen-lg mx-auto gap-y-6">
        {editing ? (
          <Body
            body={body}
            resize="y"
            className="px-8 py-6 bg-white text-sm sm:text-base"
          />
        ) : (
          <p className="p-6 bg-white text-stone-700 rounded break-words whitespace-pre-line tracking-wide leading-none">
            {body}
          </p>
        )}
        <div className="flex items-center justify-between px-2 gap-y-4">
          {editing ? (
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
              <Button color="black" disabled={loading} className="self-end">
                {loading && <Spinner />}
                {isNew
                  ? loading
                    ? "Posting..."
                    : "Post"
                  : loading
                  ? "Saving..."
                  : "Save"}
              </Button>
            </>
          ) : (
            <>
              {!!tags.length && <Tags tags={tags} />}
              <LikeButton articleId={article.id} userId={userId} />
            </>
          )}
        </div>
      </div>
    </form>
  );
}
