"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./buttons";
import Spinner from "./spinner";
import { Username, Email, Password } from "./inputs";

export default function Login({
  signUp,
  logIn,
}: {
  signUp: (formData: FormData) => Promise<undefined | string>;
  logIn: (formData: FormData) => Promise<undefined | string>;
}) {
  const [login, setLogin] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const prompt = signingUp ? "Sign Up" : "Log In";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLogin(searchParams.has("login"));
  }, [searchParams]);

  return (
    <>
      <Button
        color="emerald"
        onClick={() => {
          setLogin(true);
          document.body.style.overflow = "hidden";
        }}
      >
        Log In
      </Button>
      {login && (
        <section
          onClick={(e) => {
            if (e.target === e.currentTarget) {
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
              }}
              action={async (formData) => {
                const message = signingUp
                  ? await signUp(formData)
                  : await logIn(formData);
                if (message === "signed up") {
                  document.body.style.overflow = "auto";
                  router.push(`/${formData.get("username")}`);
                } else if (message === "logged in") {
                  document.body.style.overflow = "auto";
                  router.replace(pathname);
                } else {
                  setLoading(false);
                  message && setError(message);
                }
              }}
              className="flex flex-col gap-y-4 items-center"
            >
              <div className="flex flex-col gap-y-2 *:w-full">
                {signingUp && (
                  <Username
                    error={
                      error === "Username already taken" ? error : undefined
                    }
                  />
                )}
                <Email
                  error={
                    [
                      "Invalid credentials",
                      "Email already registered",
                    ].includes(error)
                      ? error
                      : undefined
                  }
                />
                <Password
                  signingUp={signingUp}
                  error={error === "Invalid credentials" ? error : undefined}
                />
              </div>
              <Button color="emerald" disabled={loading}>
                {loading && <Spinner />}
                {signingUp
                  ? loading
                    ? "Signing Up..."
                    : prompt
                  : loading
                  ? "Logging In..."
                  : prompt}
              </Button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
