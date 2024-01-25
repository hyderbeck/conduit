import Feed from "@/components/feed";

export default function Page() {
  return (
    <main>
      <h2>username</h2>
      <p>bio</p>
      <button>Follow</button>
      <ul>
        <li>
          <h3>Feed</h3>
        </li>
      </ul>
      <Feed />
    </main>
  );
}
