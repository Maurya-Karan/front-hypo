"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { isLoggedIn } from "../../action";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        router.push("/Login");
      } else {
        router.push("/Home");
      }
    };

    checkLoginStatus();
  }, [router]);

  return (
    <></>
  );
}