import Link from "next/link";

export default function Header() {
  const user = "username";
  const userMenu = true;

  return (
    <header>
      <h1>Conduit</h1>
      {user ? (
        <nav>
          <ul>
            <li>
              <Link href="/new">New Article</Link>
            </li>
            <li>
              <button>{user}</button>
              {userMenu && (
                <ul>
                  <li>
                    <Link href={`/${user}`}>Profile</Link>
                  </li>
                  <li>
                    <button>Log Out</button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      ) : (
        <button>Log In</button>
      )}
    </header>
  );
}
