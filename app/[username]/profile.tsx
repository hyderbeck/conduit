"use client";

import Avatar from "@/components/avatar";
import { Button, FollowButton } from "@/components/buttons";
import { InputUsername } from "@/components/login";
import { Tables } from "@/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Spinner from "@/components/spinner";

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
      className="min-h-80 bg-emerald-300 bg-hero flex items-center"
    >
      <div className="flex-1 flex p-6 gap-x-8 justify-between items-start max-w-screen-lg mx-auto min-w-0">
        <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
          <div className="flex flex-col gap-y-2 min-w-[200px] min-h-[200px]">
            <Avatar
              src={avatar && avatar}
              username={profile.username}
              width={200}
              onClick={() =>
                isEditing && avatarRef.current && avatarRef.current.click()
              }
              error={error}
              isEditing={isEditing}
              isUser={isUser}
            />
            {error === "Avatar should be less than 5 MB" && (
              <p className="text-red-500 text-sm px-2 border border-red-500 rounded bg-white w-fit text-center">
                {error}
              </p>
            )}
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
          <div className="flex flex-col gap-y-2 min-w-0">
            {isEditing ? (
              <>
                <InputUsername
                  username={profile.username}
                  error={error}
                  className="w-full max-w-[20ch]"
                />
                {error === "Username already taken" && (
                  <p className="text-red-500 text-sm px-2 border border-red-500 rounded bg-white w-fit text-center">
                    {error}
                  </p>
                )}
              </>
            ) : (
              <h2 className="text-xl font-bold text-stone-50 bg-stone-950 px-1 w-fit">
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
                spellCheck={false}
                className={`border border-stone-100 rounded placeholder:text-stone-400 px-4 py-2 max-w-sm w-[calc(100vw-48px)] sm:w-full resize-none`}
              />
            ) : (
              bio && (
                <p
                  className={`rounded bg-white px-4 py-2 text-stone-700 max-w-sm w-[calc(100vw-48px)] sm:w-full break-words whitespace-pre-line`}
                >
                  {bio}
                </p>
              )
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-y-2">
            <Button
              text={loading ? "Saving..." : "Save"}
              disabled={loading}
              className="border-stone-950 text-stone-950"
            >
              {loading && <Spinner />}
            </Button>
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              text="Cancel"
              disabled={loading}
              className="border-stone-950 text-stone-950"
            />
          </div>
        ) : isUser ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            text="Edit"
            className="border-stone-950 text-stone-950"
          />
        ) : (
          <FollowButton followingId={profile.user_id} followerId={userId} />
        )}
      </div>
    </form>
  );
}
