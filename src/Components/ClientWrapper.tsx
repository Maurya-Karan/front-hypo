"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token && pathname !== "/Login") {
      router.push("/Login");
    } else if (token && pathname === "/Login") {
      router.push("/Home");
    }
  }, [router, pathname]);

  return <>{children}</>;
}