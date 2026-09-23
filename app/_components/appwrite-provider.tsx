"use client";

import { useEffect } from "react";
import { client } from "../_lib/appwrite";

export function AppwriteProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    client
      .ping()
      .then((res) => {
        console.log("✓ Appwrite initialized and connected:", res);
      })
      .catch((err) => {
        console.log("Appwrite ping response:", err);
      });
  }, []);

  return <>{children}</>;
}
