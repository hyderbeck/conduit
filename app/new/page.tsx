import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Article from "../[username]/[slug]/article";
import { updateArticle } from "@/app/actions";

export default async function Page() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/?login=true`);
  }

  const username = (
    await supabase
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("user_id", user.id)
      .single()
  ).data!.username;

  return (
    <Article
      article={{
        author_id: user.id,
        body: "",
        created_at: "",
        slug: "",
        title: "",
        tag_list: [],
        description: "",
        id: 0,
        updated_at: "",
      }}
      username={username}
      userId={user.id}
      updateArticle={updateArticle}
      isNew
    />
  );
}
