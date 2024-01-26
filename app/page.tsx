import Feed from "@/components/feed";
import Tabs from "@/components/tabs";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    tab?: string;
  };
}) {
  const {
    data: { user },
  } = await createClient(cookies()).auth.getUser();

  const tabs = ["Home"];
  user && tabs.push("Following");

  return (
    <main>
      <h2>Conduit</h2>
      <p>A place to share your knowledge.</p>
      <Tabs tabs={tabs} />
      <Feed userId={user?.id} searchParams={searchParams} />
      <nav aria-label="pagination">
        <ul>
          <li>1</li>
        </ul>
      </nav>
      <section>
        <h3>Popular Tags</h3>
        <ul>
          <li>tag</li>
        </ul>
      </section>
    </main>
  );
}
