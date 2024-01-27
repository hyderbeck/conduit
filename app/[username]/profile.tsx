"use client";

import Avatar from "@/components/avatar";
import { FollowButton } from "@/components/buttons";
import { InputUsername } from "@/components/login";
import { Tables } from "@/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Profile({
  profile,
  userId,
  updateProfile,
}: {
  profile: Tables<"profiles">;
  userId?: string;
  updateProfile: (
    formData: FormData,
    currentUsername: string
  ) => Promise<string | undefined>;
}) {
  const isUser = userId === profile.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const avatarRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [bio, setBio] = useState(profile.bio);

  return (
    <form
      onSubmit={() => {
        if (!isEditing) return;
        setError("");
        setLoading(true);
      }}
      action={async (formData) => {
        const error = await updateProfile(formData, profile.username);
        if (error === "success") {
          setLoading(false);
          if (formData.get("username") !== profile.username) {
            router.replace(`/${formData.get("username")}`);
          } else {
            setBio(formData.get("bio") as string);
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
            <Avatar
              src={avatar && avatar}
              username={profile.username}
              width={200}
            />
            {error === "Avatar should be less than 5 MB" && <p>{error}</p>}
            <input
              type="file"
              aria-label="avatar"
              name="avatar"
              accept="image/*"
              onChange={(e) => {
                if (isEditing && e.target.files && e.target.files[0]) {
                  if (e.target.files[0].size > 5000000) {
                    setError("Avatar should be less than 5 MB");
                  } else {
                    setError("");
                    setAvatar(URL.createObjectURL(e.target.files[0]));
                  }
                }
              }}
              ref={avatarRef}
              className="hidden"
            />
          </div>
          <div>
            {isEditing ? (
              <>
                <InputUsername username={profile.username} />
                {error === "Username already taken" && <p>{error}</p>}
              </>
            ) : (
              <h2>
                <i>@</i>
                {profile.username}
              </h2>
            )}
            {isEditing ? (
              <textarea
                placeholder="Bio"
                aria-label="bio"
                name="bio"
                rows={8}
                cols={40}
                maxLength={160}
                defaultValue={bio || undefined}
              />
            ) : (
              bio && <p>{bio}</p>
            )}
          </div>
        </div>
        {isEditing ? (
          <div>
            <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        ) : isUser ? (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <FollowButton followingId={profile.user_id} followerId={userId} />
        )}
      </div>
    </form>
  );
}
