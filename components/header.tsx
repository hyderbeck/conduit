import Link from "next/link";
import Login from "./login";
import { createClient } from "@/supabase";
import { cookies } from "next/headers";
import { z } from "zod";

async function signUp(formData: FormData) {
  "use server";

  const supabase = createClient(cookies());

  const User = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9]+$/),
  });

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!User.safeParse({ email, password, username }).success) return;

  if (
    (
      await supabase
        .schema("conduit")
        .from("profiles")
        .select()
        .eq("username", username)
        .single()
    ).data
  )
    return "Username already taken";

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (!error) {
    await supabase.schema("conduit").from("profiles").insert({
      username,
      email,
      user_id: user!.id,
    });
  }

  if (error && error.message === "User already registered")
    return "Email already registered";
}

async function logIn(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await createClient(cookies()).auth.signInWithPassword({
    email,
    password,
  });

  if (error && error.message === "Invalid login credentials")
    return "Invalid credentials";
}

export default function Header() {
  const user = false;
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
