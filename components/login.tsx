"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./buttons";
import Spinner from "./spinner";
import clsx from "clsx";

export function InputUsername({
  username,
  error,
  className,
}: {
  username?: string;
  error?: string;
  className?: string;
}) {
  return (
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
      defaultValue={username}
      spellCheck={false}
      autoComplete="on"
      className={clsx(
        "px-4 py-2 border border-stone-100 rounded placeholder:text-stone-400 w-[20ch]",
        error === "Username already taken" && "!border-red-500",
        className
      )}
    />
  );
}

export default function Login({
  signUp,
  logIn,
}: {
  signUp: (formData: FormData) => Promise<undefined | string>;
  logIn: (formData: FormData) => Promise<undefined | string>;
}) {
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const prompt = signingUp ? "Sign Up" : "Log In";
  const buttonPrompt = signingUp
    ? loading
      ? "Signing Up..."
      : prompt
    : loading
    ? "Logging In..."
    : prompt;
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    setLogin(searchParams.has("login"));
  }, [searchParams]);

  return (
    <>
      <Button
        onClick={() => {
          setLogin(true);
          document.body.style.overflow = "hidden";
        }}
        text="Log In"
      />
      {login && (
        <section
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLogin(false);
              document.body.style.overflow = "auto";
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setLogin(false);
              document.body.style.overflow = "auto";
            }
          }}
          className="fixed top-0 left-0 w-full h-full backdrop-blur z-10"
        >
          <div className="absolute w-fit h-fit top-0 right-0 bottom-0 left-0 m-auto p-12 rounded flex flex-col justify-center items-center gap-y-4 bg-stone-50">
            <div className="flex flex-col justify-center items-center">
              <h3 className="text-lg font-medium">{prompt}</h3>
              <button
                onClick={() => {
                  setError("");
                  loading && setLoading(!loading);
                  setSigningUp(!signingUp);
                }}
                className="text-emerald-300 text-sm"
                disabled={loading}
              >
                {signingUp ? "Already have an account?" : "Need an account?"}
              </button>
            </div>
            <form
              onSubmit={() => {
                setError("");
                setLoading(true);
                document.body.style.overflow = "auto";
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
                  document.body.style.overflow = "hidden";
                  setLoading(false);
                  error && setError(error);
                }
              }}
              className="flex flex-col gap-y-4 items-center"
            >
              <div className="flex flex-col gap-y-2 *:w-full">
                {signingUp && <InputUsername error={error} />}
                {error === "Username already taken" && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  aria-label="email"
                  name="email"
                  required
                  autoComplete="on"
                  className={clsx(
                    "px-4 py-2 border border-stone-100 rounded placeholder:text-stone-400",
                    [
                      "Invalid credentials",
                      "Email already registered",
                    ].includes(error) && "!border-red-500"
                  )}
                />
                {error === "Email already registered" && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <input
                  type="password"
                  placeholder="Password"
                  aria-label="password"
                  name="password"
                  required
                  minLength={signingUp ? 6 : undefined}
                  maxLength={signingUp ? 20 : undefined}
                  autoComplete="on"
                  className={clsx(
                    "px-4 py-2 border border-stone-100 rounded placeholder:text-stone-400",
                    error === "Invalid credentials" && "!border-red-500"
                  )}
                />
                {error === "Invalid credentials" && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
              <Button
                text={buttonPrompt}
                className="flex gap-x-2 items-center"
                disabled={loading}
              >
                {loading && <Spinner />}
              </Button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
