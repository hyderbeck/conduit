import Feed from "@/components/feed";
import Tabs from "@/components/tabs";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import Tags from "@/components/tags";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    tab?: string;
    tag?: string;
  };
}) {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tabs = ["Home"];
  user && tabs.push("Following");

  const tags: {
    tag: string;
    counter: number;
  }[] = [];
  for (const article of (
    await supabase.schema("conduit").from("articles").select()
  ).data!) {
    if (article.tag_list)
      for (const tag of article.tag_list) {
        if (!tags.find((t) => t.tag === tag)) {
          tags.push({ tag, counter: 1 });
        } else {
          tags.find((t) => t.tag === tag)!.counter++;
        }
      }
  }
  tags.sort((a, b) => b.counter - a.counter).slice(0, 20);

  if (searchParams?.tag) tabs.push(searchParams?.tag);

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
        <Tags tags={tags.map((t) => t.tag)} />
      </section>
    </main>
  );
}
