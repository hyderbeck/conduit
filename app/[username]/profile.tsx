"use client";

import Avatar from "@/components/avatar";
import { FollowButton } from "@/components/buttons";
import { InputUsername } from "@/components/login";
import { Tables } from "@/types";
import { useState } from "react";

export default function Profile({
  profile,
  userId,
}: {
  profile: Tables<"profiles">;
  userId?: string;
}) {
  const isUser = userId === profile.user_id;
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <form>
        <Avatar username={profile.username} width={200} />
        <InputUsername username={profile.username} />
        <input type="file" aria-label="avatar" name="avatar" accept="image/*" />
        <input
          type="text"
          placeholder="Bio"
          aria-label="bio"
          name="bio"
          defaultValue={profile.bio || undefined}
          maxLength={200}
        />
        <button>Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <>
      <Avatar username={profile.username} width={200} />
      <h2>{profile.username}</h2>
      {profile.bio && <p>{profile.bio}</p>}
      {isUser ? (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      ) : (
        <FollowButton followingId={profile.user_id} followerId={userId} />
      )}
    </>
  );
}
