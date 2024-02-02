"use server";

import { createClient } from "@/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

export async function updateArticle(
  formData: FormData,
  tags: string[],
  currentSlug: string,
  userId: string,
  currentArticleId: number,
  isNew?: boolean
) {
  "use server";

  const supabase = createClient(cookies());

  const ArticleSchema = z.object({
    title: z.string().max(100).optional(),
  });

  const title = (formData.get("title") as string).trim();

  if (!ArticleSchema.safeParse({ title }).success) return;

  const slug = encodeURIComponent(title.toLowerCase().split(" ").join("-"));

  const articleExists = (
    await supabase
      .schema("conduit")
      .from("articles")
      .select()
      .eq("slug", slug)
      .eq("author_id", userId)
      .single()
  ).data!;

  if (articleExists && articleExists.id !== currentArticleId)
    return "You can't have two articles with the same title";

  const body = (formData.get("body") as string).trim();

  if (isNew) {
    await supabase.schema("conduit").from("articles").insert({
      author_id: userId,
      title,
      slug,
      body,
      tag_list: tags,
    });
  } else {
    await supabase
      .schema("conduit")
      .from("articles")
      .update({
        title,
        body,
        tag_list: tags,
        slug,
      })
      .eq("slug", currentSlug);
  }

  revalidatePath("/", "layout");
  return slug;
}
