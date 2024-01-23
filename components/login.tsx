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

export default function Login() {
  const signingUp = true;
  const prompt = signingUp ? "Sign Up" : "Log In";
  const login = true;

  return (
    <>
      <button>Log In</button>
      {login && (
        <section>
          <h3>{prompt}</h3>
          <button>
            {signingUp ? "Already have an account?" : "Need an account?"}
          </button>
          <form action={signUp}>
            <input
              type="email"
              placeholder="Email"
              aria-label="email"
              name="email"
              required
            />
            <input
              type="password"
              placeholder="Password"
              aria-label="password"
              name="password"
              required
            />
            <button>{prompt}</button>
          </form>
        </section>
      )}
    </>
  );
}
