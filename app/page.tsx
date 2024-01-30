import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import Tags from "@/components/tags";
import Tabs from "@/components/tabs";
import Feed from "@/components/feed";
import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    tab?: string;
    tag?: string;
    page?: number;
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
      <div className="min-h-80 flex items-center justify-center bg-emerald-300 bg-hero">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-stone-50 bg-stone-950 px-1 font-black text-7xl mt-8">
            conduit
          </h2>
          <div className="flex gap-x-1 ml-auto">
            <a
              href="https://github.com/hyderbeck/next-realworld-example-app"
              target="_blank"
              className="bg-stone-50 text-stone-950 p-1 rounded"
            >
              <Image
                src="/github-mark.svg"
                alt="GitHub"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://realworld-docs.netlify.app/docs/implementation-creation/features"
              target="_blank"
              className="bg-stone-50 text-stone-950 p-1 rounded"
            >
              <Image
                src="/realworld.png"
                alt="RealWorld"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 sm:flex-row max-w-screen-lg mx-auto my-8">
        <section className="flex-1 mx-6 flex flex-col">
          <Tabs tabs={tabs} />
          <Feed searchParams={searchParams} />
        </section>
        <section className="bg-stone-100 px-6 py-4 flex flex-col gap-4 h-fit sm:p-4 sm:mr-6 sm:rounded sm:max-w-48">
          <h3 className="font-bold">Popular Tags</h3>
          <Tags tags={tags.map((t) => t.tag)} colored />
        </section>
      </div>
    </main>
  );
}
