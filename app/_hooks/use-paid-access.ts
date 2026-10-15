"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../_context/auth-context";

export const ADMIN_EMAILS = ["akdeepaknyc@gmail.com", "sibeshagrawal5@gmail.com"];

export function usePaidAccess() {
  const { user, loading: authLoading } = useAuth();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsPaid(false);
      setChecking(false);
      return;
    }

    const email = user.email?.toLowerCase().trim() || "";

    // Check user past payments from database
    const uId = user.$id || (user as any).id || "";
    const query = uId ? `userId=${encodeURIComponent(uId)}` : `email=${encodeURIComponent(email)}`;

    fetch(`/api/razorpay/user-payments?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.payments)) {
          const now = Date.now();
          const active = data.payments.some((p: any) => {
            if (p.status !== "paid") return false;
            if (!p.expiresAt) return true;
            return new Date(p.expiresAt).getTime() > now;
          });
          setIsPaid(active);
        } else {
          setIsPaid(false);
        }
      })
      .catch(() => setIsPaid(false))
      .finally(() => setChecking(false));
  }, [user, authLoading]);

  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

  return { isPaid, checking, isAdmin, user };
}
