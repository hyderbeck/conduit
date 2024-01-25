export default function Page() {
  return (
    <main>
      <h2>Conduit</h2>
      <p>A place to share your knowledge.</p>
      <section>
        <ul>
          <li>
            <h3>Feed</h3>
          </li>
        </ul>
        <article>
          <address>author</address>
          <time>date</time>
          <button>Like</button>
          <h4>title</h4>
          <p>body</p>
          <p>Read more...</p>
          <ul>
            <li>tag</li>
          </ul>
        </article>
      </section>
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
