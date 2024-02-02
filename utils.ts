import { createClient } from "./supabase";

export async function usernameExists(
  supabase: ReturnType<typeof createClient>,
  username: string
) {
  return (
    await supabase
      .schema("conduit")
      .from("profiles")
      .select()
      .eq("username", username)
      .single()
  ).data;
}
