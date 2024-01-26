import Link from "next/link";

export default function Tags({ tags }: { tags: string[] }) {
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/?tag=${tag.toLowerCase()}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  );
}
