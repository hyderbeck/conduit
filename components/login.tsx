"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login({
  signUp,
  logIn,
}: {
  signUp: (formData: FormData) => Promise<undefined | string>;
  logIn: (formData: FormData) => Promise<undefined | string>;
}) {
  const [signingUp, setSigningUp] = useState(false);
  const prompt = signingUp ? "Sign Up" : "Log In";
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const [login, setLogin] = useState(searchParams.has("login"));

  useEffect(() => {
    setLogin(searchParams.has("login"));
  }, [searchParams]);

  return (
    <>
      <button onClick={() => setLogin(!login)}>Log In</button>
      {login && (
        <section>
          <h3>{prompt}</h3>
          <button
            onClick={() => {
              setError("");
              setSigningUp(!signingUp);
            }}
          >
            {signingUp ? "Already have an account?" : "Need an account?"}
          </button>
          <form
            onSubmit={() => {
              setError("");
            }}
            action={async (formData) => {
              const error = signingUp
                ? await signUp(formData)
                : await logIn(formData);
              if (error === "signed up") {
                router.push(`/${formData.get("username")}`);
              } else if (error === "logged in") {
                router.replace(pathname);
              } else {
                error && setError(error);
              }
            }}
          >
            {signingUp && (
              <input
                type="text"
                placeholder="Username"
                aria-label="username"
                name="username"
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9]+"
                title="Username can only contain letters and numbers"
                autoComplete="on"
              />
            )}
            {error === "Username already taken" && <p>{error}</p>}
            <input
              type="email"
              placeholder="Email"
              aria-label="email"
              name="email"
              required
              autoComplete="on"
            />
            {error === "Email already registered" && <p>{error}</p>}
            <input
              type="password"
              placeholder="Password"
              aria-label="password"
              name="password"
              required
              minLength={signingUp ? 6 : undefined}
              maxLength={signingUp ? 20 : undefined}
              autoComplete="on"
            />
            {error === "Invalid credentials" && <p>{error}</p>}
            <button>{prompt}</button>
          </form>
        </section>
      )}
    </>
  );
}
