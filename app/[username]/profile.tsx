"use client";

import Avatar from "@/components/avatar";
import {
  Button,
  CancelButton,
  EditButton,
  FollowButton,
} from "@/components/buttons";
import { Tables } from "@/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Spinner from "@/components/spinner";
import { Bio, Username } from "@/components/inputs";

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

  const [bio, setBio] = useState(profile.bio);
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const avatarRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={() => {
        if (!editing) return;
        setError("");
        setLoading(true);
      }}
      action={async (formData) => {
        const message = await updateProfile(formData, profile.username);
        if (message === "success") {
          setLoading(false);
          if (formData.get("username") !== profile.username) {
            router.replace(`/${formData.get("username")}`);
          } else {
            setBio(formData.get("bio") as string);
            setEditing(false);
          }
        } else {
          message && setError(message);
          setLoading(false);
        }
      }}
      className="min-h-80 bg-emerald-300 bg-hero flex items-center"
    >
      <div className="flex-1 flex p-6 gap-x-8 justify-between items-start max-w-screen-lg mx-auto min-w-0">
        <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
          <div className="flex flex-col gap-y-2 min-w-[200px] min-h-[200px]">
            <Avatar
              username={profile.username}
              width={200}
              src={avatar}
              onClick={() =>
                editing && avatarRef.current && avatarRef.current.click()
              }
              editing={editing}
              error={
                error === "Avatar should be less than 5 MB" ? error : undefined
              }
            />
            <input
              type="file"
              aria-label="avatar"
              name="avatar"
              accept="image/*"
              onChange={(e) => {
                if (editing && e.target.files && e.target.files[0]) {
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
            {editing ? (
              <Username
                username={profile.username}
                error={error === "Username already taken" ? error : undefined}
                className="w-full max-w-[20ch]"
                errorClassName="px-2 border border-red-500 rounded bg-white w-fit text-center"
              />
            ) : (
              <h2 className="text-xl font-bold text-stone-50 bg-stone-950 px-1 py-0.5 rounded w-fit">
                <i>@</i>
                {profile.username}
              </h2>
            )}
            {editing ? (
              <Bio
                bio={bio as string}
                className="px-4 py-2 max-w-sm w-[calc(100vw-48px)] sm:w-full"
              />
            ) : (
              bio && (
                <p
                  className={`rounded bg-white px-4 py-2 text-stone-700 max-w-sm w-[calc(100vw-48px)] sm:w-full break-words whitespace-pre-line leading-none tracking-wide text-sm`}
                >
                  {bio}
                </p>
              )
            )}
          </div>
        </div>
        {editing ? (
          <div className="flex flex-col gap-y-2">
            <Button color="black" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Saving..." : "Save"}
            </Button>
            <CancelButton onClick={() => setEditing(false)} loading={loading} />
          </div>
        ) : isUser ? (
          <EditButton onClick={() => setEditing(true)} />
        ) : (
          <FollowButton followingId={profile.user_id} followerId={userId} />
        )}
      </div>
    </form>
  );
}
