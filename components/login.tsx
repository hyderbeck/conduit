"use client";

import { useState } from "react";

export default function Login({
  signUp,
  logIn,
}: {
  signUp: (formData: FormData) => Promise<undefined | string>;
  logIn: (formData: FormData) => Promise<undefined | string>;
}) {
  const [signingUp, setSigningUp] = useState(false);
  const prompt = signingUp ? "Sign Up" : "Log In";
  const [login, setLogin] = useState(true);
  const [error, setError] = useState("");

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
            action={async (formData) => {
              const error = signingUp
                ? await signUp(formData)
                : await logIn(formData);
              error ? setError(error) : setError("");
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
