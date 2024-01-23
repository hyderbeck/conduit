import Link from "next/link";
import Login from "./login";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";

async function signUp(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await createClient(cookies()).auth.signUp({
    email,
    password,
  });
}

async function logIn(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await createClient(cookies()).auth.signInWithPassword({
    email,
    password,
  });
}

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
        <Login signUp={signUp} logIn={logIn} />
      )}
    </header>
  );
}
