"use client";

import Avatar from "@/components/avatar";
import { FollowButton, LikeButton } from "@/components/buttons";
import Tags from "@/components/tags";
import { Tables } from "@/types";
import Link from "next/link";
import { useState } from "react";

export default function Article({
  article,
  username,
  userId,
}: {
  article: Tables<"articles">;
  username: string;
  userId?: string;
}) {
  const isUser = userId === article.author_id;
  const [isEditing, setIsEditing] = useState(false);
  const [tags, setTags] = useState(article.tag_list || []);

  if (isEditing) {
    return (
      <form>
        <input
          type="text"
          placeholder="Title"
          aria-label="title"
          name="title"
          required
          defaultValue={article.title}
          maxLength={50}
        />
        <Avatar username={username} width={48} />
        <address>{username}</address>
        <textarea
          placeholder="Body"
          aria-label="body"
          name="body"
          required
          defaultValue={article.body}
        />
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
        <button>Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <main>
      <h2>{article.title}</h2>
      <Avatar username={username} width={48} />
      <Link href={`/${username}`}>
        <address>{username}</address>
      </Link>
      {isUser ? (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      ) : (
        <FollowButton followingId={article.author_id} followerId={userId} />
      )}
      <LikeButton articleId={article.id} userId={userId} />
      <p>{article.body}</p>
      {article.tag_list?.length && <Tags tags={article.tag_list} />}
    </main>
  );
}
