import Feed from "@/components/feed";

export default function Page() {
  return (
    <main>
      <h2>Conduit</h2>
      <p>A place to share your knowledge.</p>
      <ul>
        <li>
          <h3>Home</h3>
        </li>
      </ul>
      <Feed />
      <section>
        <h3>Popular Tags</h3>
        <ul>
          <li>tag</li>
        </ul>
      </section>
    </main>
  );
}
