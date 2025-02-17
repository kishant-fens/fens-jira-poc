"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

export default function OAuthRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(searchParams);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    let client_id;
    let client_secret;
    if (state) {
      client_id = state.split(",")[0];
      client_secret = state.split(",")[1];
    }

    if (code) {
      fetch("/api/setup/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, client_id, client_secret }),
      })
        .then((res) => {
          res.json();
        })
        .then(() => {
          window.opener.postMessage("authorized", "*");
          window.close();
        })
        .catch((err) => console.error(err))
        .finally(() => window.close());
    }
  }, [searchParams]);

  return (
    <Suspense>
      <div>Processing authorization...</div>
    </Suspense>
  );
}
