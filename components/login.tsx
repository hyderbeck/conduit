"use client";

import { useState } from "react";

export default function Login({
  signUp,
  logIn,
}: {
  signUp: (formData: FormData) => Promise<void>;
  logIn: (formData: FormData) => Promise<void>;
}) {
  const [signingUp, setSigningUp] = useState(false);
  const prompt = signingUp ? "Sign Up" : "Log In";
  const [login, setLogin] = useState(true);

  return (
    <>
      <button onClick={() => setLogin(!login)}>Log In</button>
      {login && (
        <section>
          <h3>{prompt}</h3>
          <button onClick={() => setSigningUp(!signingUp)}>
            {signingUp ? "Already have an account?" : "Need an account?"}
          </button>
          <form action={signingUp ? signUp : logIn}>
            {signingUp && (
              <input
                type="text"
                placeholder="Username"
                aria-label="username"
                name="username"
                required
              />
            )}
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
