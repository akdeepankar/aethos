"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../_context/auth-context";

interface Plan {
  id: string;
  name: string;
  price: string;
  amount: number; // in INR
  subtext: string;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "3_months",
    name: "3 Months",
    price: "₹ 4,500",
    amount: 4500,
    subtext: "Works out to ₹1,500/month",
  },
  {
    id: "6_months",
    name: "6 Months",
    price: "₹ 7,500",
    amount: 7500,
    subtext: "Works out to ₹1,250/month",
  },
  {
    id: "1_year",
    name: "1 Year",
    price: "₹ 12,000",
    amount: 12000,
    subtext: "Works out to ₹1,000/month",
    badge: "BEST VALUE",
  },
];

const COMMON_FEATURES = [
  "2-3 stock deep dives per month",
  "2 thematic/sectoral primers every month",
  "IPO Deep dive notes",
  "Access to full Library",
  "Important Market announcement",
  "Results and concall analysis",
];

const COUNTRY_CODES = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "SG" },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MembershipPage() {
  const { user, loading: authLoading } = useAuth();

  const [mainTab, setMainTab] = useState<"membership" | "past_payments">("membership");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("1_year");
  const [fullName, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);

  const [pastPayments, setPastPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchPastPayments = async () => {
    if (!user?.$id && !user?.email && !email) {
      setInitialLoading(false);
      return;
    }
    setLoadingPayments(true);
    try {
      const uId = user?.$id || (user as any)?.id || "";
      const uEmail = user?.email || email || "";
      const query = uId ? `userId=${encodeURIComponent(uId)}` : `email=${encodeURIComponent(uEmail)}`;

      const res = await fetch(`/api/razorpay/user-payments?${query}`);
      const data = await res.json();
      if (data.success) {
        setPastPayments(data.payments || []);
      }
    } catch (err) {
      console.error("Error fetching past payments:", err);
    } finally {
      setLoadingPayments(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user?.$id || user?.email || email) {
        fetchPastPayments();
      } else {
        setInitialLoading(false);
      }
    }
  }, [authLoading, user, email]);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    if (user) {
      if (user.name && !fullName) setName(user.name);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phoneNumber) {
        if (user.phone.startsWith("+")) {
          const match = COUNTRY_CODES.find((c) => user.phone.startsWith(c.code));
          if (match) {
            setCountryCode(match.code);
            setPhoneNumber(user.phone.replace(match.code, "").trim());
          } else {
            setPhoneNumber(user.phone);
          }
        } else {
          setPhoneNumber(user.phone);
        }
      }
    }
  }, [user]);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[2];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPayment(true);

    try {
      // 1. Create order on server (with customer details for Razorpay Customer & Appwrite tracking)
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlan.amount,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          customerName: fullName,
          customerEmail: email,
          customerPhone: `${countryCode}${phoneNumber}`,
          userId: user?.$id || (user as any)?.id || "",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to initialize payment: " + (data.error || "Unknown error"));
        setLoadingPayment(false);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Aethos Research",
        description: `${selectedPlan.name} Membership`,
        order_id: data.orderId,
        customer_id: data.customerId || undefined,
        prefill: {
          name: fullName,
          email: email,
          contact: `${countryCode}${phoneNumber}`,
        },
        theme: {
          color: "#0f172a",
        },
        handler: async function (response: any) {
          try {
            // Verify payment and update Appwrite record
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                amount: selectedPlan.amount,
                customerName: fullName,
                customerEmail: email,
                customerPhone: `${countryCode}${phoneNumber}`,
                userId: user?.$id || (user as any)?.id || "",
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert(`Payment Successful & Verified!\nPayment ID: ${response.razorpay_payment_id}\nYour subscription record has been recorded.`);
              fetchPastPayments();
            } else {
              alert(`Payment completed but verification failed: ${verifyData.error}`);
            }
          } catch (vErr) {
            console.error("Verification error:", vErr);
            alert(`Payment completed (Payment ID: ${response.razorpay_payment_id})`);
          } finally {
            setLoadingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPayment(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoadingPayment(false);
      }
    } catch (err: any) {
      console.error("Payment trigger error:", err);
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "#ffffff",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0f172a",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div
          style={{
            fontSize: "13.5px",
            fontWeight: "600",
            color: "#64748b",
            letterSpacing: "0.02em",
          }}
        >
          Loading membership details...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        color: "#0f172a",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <style>{`
        .membership-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 0;
          align-items: stretch;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }
        .column-left {
          padding: 36px 32px;
          background: #fafafa;
          border-right: 2px solid #e2e8f0;
        }
        .column-right {
          padding: 36px 32px;
          background: #ffffff;
        }
        .plan-card:hover {
          border-color: #cbd5e1 !important;
        }
        .plan-card.selected:hover {
          border-color: #0f172a !important;
        }
        @media (max-width: 868px) {
          .membership-grid {
            grid-template-columns: 1fr;
          }
          .column-left {
            border-right: none;
            border-bottom: 2px solid #e2e8f0;
            padding: 24px 20px;
          }
          .column-right {
            padding: 24px 20px;
          }
        }
      `}</style>

      {/* FULL-WIDTH TOP SUB-NAVBAR TABS */}
      <div
        style={{
          width: "100%",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[
              {
                id: "membership",
                label: "Membership",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
              },
              {
                id: "past_payments",
                label: "Past Payments",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
              },
            ].map((tab) => {
              const isActive = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 4px 14px",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid #0f172a" : "2px solid transparent",
                    color: isActive ? "#0f172a" : "#64748b",
                    fontWeight: isActive ? "700" : "500",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    marginBottom: "-1px",
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
            {mainTab === "past_payments" && (
              <button
                type="button"
                onClick={fetchPastPayments}
                style={{
                  background: "transparent",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  color: "#0f172a",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6"/>
                  <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"/>
                </svg>
                <span>{loadingPayments ? "Refreshing..." : "Refresh"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >

      {/* TAB 1: MEMBERSHIP VIEW */}
      {mainTab === "membership" && (() => {
        let latestPaidPayment = pastPayments.find(
          (p) => p.status === "paid" || p.status === "PAID"
        );

        const hasExpiry = Boolean(latestPaidPayment?.expiresAt);
        const expiresTime = hasExpiry ? new Date(latestPaidPayment.expiresAt).getTime() : 0;
        const now = Date.now();

        const isActive = Boolean(latestPaidPayment && hasExpiry && expiresTime > now);
        const isExpired = Boolean(latestPaidPayment && hasExpiry && expiresTime <= now);

        let badgeText = "• FREE ACCESS";
        let badgeBg = "#e2e8f0";
        let badgeColor = "#475569";
        let statusText = "Free Access (No Active Plan)";
        let statusColor = "#ca8a04";
        let descriptionText = "Sign in or select a membership plan to upgrade to full research access.";
        let buttonText = "Choose a Plan & Upgrade →";

        if (isActive) {
          badgeText = "• ACTIVE MEMBER";
          badgeBg = "#dcfce7";
          badgeColor = "#166534";
          statusText = "Active Member";
          statusColor = "#16a34a";
          descriptionText = "Full access to institutional research, financial models, and scuttlebutt notes.";
          buttonText = "Extend / Upgrade Membership →";
        } else if (isExpired) {
          badgeText = "• EXPIRED";
          badgeBg = "#fee2e2";
          badgeColor = "#991b1b";
          statusText = "Subscription Expired";
          statusColor = "#dc2626";
          descriptionText = "Your Membership has expired. Renew your plan to restore full institutional research access.";
          buttonText = "Renew Membership Plan →";
        } else if (user) {
          statusText = "Free Access Account";
          descriptionText = "You are currently on free access. Select a membership plan below for full institutional access.";
        }

        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "40px",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {/* COLUMN 1: ACCOUNT OVERVIEW LONG TICKET CARD */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                overflow: "hidden",
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* TICKET TOP HEADER */}
              <div
                style={{
                  background: "#0f172a",
                  color: "#ffffff",
                  padding: "16px 20px",
                  minHeight: "54px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c59b27" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                    <path d="M13 5v14" strokeDasharray="2 2" />
                  </svg>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "#c59b27", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    MEMBER PASS
                  </span>
                </div>
              </div>

              {/* TICKET UPPER BODY */}
              <div style={{ padding: "20px 18px 16px" }}>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                  {user ? (user.name || user.email) : "Guest Reader"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: "1.4" }}>
                  {descriptionText}
                </div>
              </div>

              {/* PERFORATED DOTTED TICKET DIVIDER WITH NOTCHES */}
              <div style={{ position: "relative", margin: "4px 0" }}>
                <div
                  style={{
                    borderTop: "2px dashed #cbd5e1",
                    width: "100%",
                  }}
                />
                {/* LEFT CIRCULAR NOTCH */}
                <div
                  style={{
                    position: "absolute",
                    left: "-10px",
                    top: "-10px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#f8fafc",
                    borderRight: "1px solid #e2e8f0",
                  }}
                />
                {/* RIGHT CIRCULAR NOTCH */}
                <div
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "-10px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#f8fafc",
                    borderLeft: "1px solid #e2e8f0",
                  }}
                />
              </div>

              {/* TICKET LOWER DETAILS BODY */}
              <div style={{ padding: "16px 18px 20px", background: "#ffffff", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Status</span>
                    <span style={{ fontWeight: "700", color: statusColor }}>
                      {statusText}
                    </span>
                  </div>

                  {latestPaidPayment?.planName && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748b" }}>Plan Tier</span>
                      <span style={{ fontWeight: "700", color: "#0f172a" }}>
                        {latestPaidPayment.planName}
                      </span>
                    </div>
                  )}

                  {hasExpiry && latestPaidPayment?.expiresAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748b" }}>{isActive ? "Expires" : "Expired On"}</span>
                      <span style={{ fontWeight: "700", color: isActive ? "#854d0e" : "#dc2626" }}>
                        {new Date(latestPaidPayment.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Billing</span>
                    <span style={{ fontWeight: "500", color: "#0f172a" }}>One-Time</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Library</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {isActive ? "Unlimited" : "Limited"}
                    </span>
                  </div>
                </div>

                {/* TICKET DECORATIVE BARCODE */}
                <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "28px",
                      opacity: 0.65,
                      marginBottom: "6px",
                    }}
                  >
                    {[3,1,2,4,1,3,2,1,4,2,1,3,1,2,4,2,1,3,2,1].map((w, i) => (
                      <div key={i} style={{ width: `${w}px`, height: "100%", background: "#0f172a" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#94a3b8", letterSpacing: "0.15em" }}>
                    {user?.$id ? `ATH-${user.$id.slice(-8).toUpperCase()}` : "ATH-GUEST-PASS"}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: RIGHT COL FITTING VIEWPORT */}
            <div style={{ width: "100%", height: "100%" }}>
              {isActive ? (
                /* DISPLAY ACTIVE PLAN INFO IN LONG TICKET CARD */
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                    overflow: "hidden",
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* TICKET TOP HEADER */}
                  <div
                    style={{
                      background: "#0f172a",
                      color: "#ffffff",
                      padding: "16px 20px",
                      minHeight: "54px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c59b27" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#c59b27", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        AETHOS WEALTH PASS
                      </span>
                    </div>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        letterSpacing: "0.06em",
                      }}
                    >
                      • ACTIVE
                    </span>
                  </div>

                  {/* TICKET MAIN BODY */}
                  <div style={{ padding: "24px", position: "relative" }}>
                    {/* ROUND ACTIVE STAMP */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "24px",
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        border: "2px solid #16a34a",
                        outline: "1px dashed #16a34a",
                        outlineOffset: "-4px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "rotate(-14deg)",
                        color: "#16a34a",
                        opacity: 0.88,
                        pointerEvents: "none",
                        userSelect: "none",
                        background: "rgba(220, 252, 231, 0.25)",
                      }}
                    >
                      <span style={{ fontSize: "6.5px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        AETHOS
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: "1.05", margin: "1px 0" }}>
                        ACTIVE
                      </span>
                      <span style={{ fontSize: "6px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        VERIFIED
                      </span>
                    </div>

                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#854d0e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                      CURRENT ACTIVE PLAN
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "6px", paddingRight: "76px" }}>
                      {latestPaidPayment?.planName || "Membership Pass"}
                    </div>
                    <div style={{ fontSize: "13.5px", color: "#64748b", paddingRight: "76px" }}>
                      Your subscription is active and valid until <strong style={{ color: "#0f172a" }}>{new Date(latestPaidPayment.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong>.
                    </div>
                  </div>

                  {/* PERFORATED DOTTED TICKET DIVIDER WITH NOTCHES */}
                  <div style={{ position: "relative", margin: "4px 0" }}>
                    <div
                      style={{
                        borderTop: "2px dashed #cbd5e1",
                        width: "100%",
                      }}
                    />
                    {/* LEFT CIRCULAR NOTCH */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-10px",
                        top: "-10px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#f8fafc",
                        borderRight: "1px solid #e2e8f0",
                      }}
                    />
                    {/* RIGHT CIRCULAR NOTCH */}
                    <div
                      style={{
                        position: "absolute",
                        right: "-10px",
                        top: "-10px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#f8fafc",
                        borderLeft: "1px solid #e2e8f0",
                      }}
                    />
                  </div>

                  {/* TICKET LOWER BODY: INCLUDED FEATURES */}
                  <div style={{ padding: "24px", background: "#fffaf0" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#854d0e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                      INCLUDED IN YOUR ACTIVE PASS
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      {COMMON_FEATURES.map((feature, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                          <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* TICKET FOOTER BARCODE */}
                    <div style={{ paddingTop: "16px", borderTop: "1px solid #f3e8c8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: "700", color: "#0f172a" }}>
                          ORDER ID: {latestPaidPayment?.paymentId || latestPaidPayment?.orderId || "PAID"}
                        </div>
                        <div style={{ fontSize: "9.5px", color: "#854d0e", marginTop: "2px" }}>
                          VERIFIED BY RAZORPAY • ONE-TIME CHECKOUT
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "3px",
                          alignItems: "center",
                          height: "26px",
                          opacity: 0.7,
                        }}
                      >
                        {[3,1,4,1,2,3,1,4,2,1,3,1,4,1,2,3,2,1].map((w, i) => (
                          <div key={i} style={{ width: `${w}px`, height: "100%", background: "#0f172a" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* DISPLAY FULL MEMBERSHIP CHECKOUT STEPS (NO WRAPPING CARD, STAY IN SAME TAB) */
                <div style={{ width: "100%" }}>
                  {/* STEP TABS */}
                  <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                    <div
                      onClick={() => setCurrentStep(1)}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        borderRadius: "12px",
                        background: currentStep === 1 ? "#0f172a" : "#ffffff",
                        border: currentStep === 1 ? "1.5px solid #0f172a" : "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: currentStep === 1 ? "0 4px 14px rgba(15, 23, 42, 0.12)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: currentStep === 1 ? "#c59b27" : "#e2e8f0",
                          color: currentStep === 1 ? "#ffffff" : "#475569",
                          fontSize: "11px",
                          fontWeight: "800",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        1
                      </span>
                      <div>
                        <div style={{ fontSize: "9px", fontWeight: "800", color: currentStep === 1 ? "#c59b27" : "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          STEP 1
                        </div>
                        <div style={{ fontSize: "13.5px", fontWeight: "700", color: currentStep === 1 ? "#ffffff" : "#0f172a" }}>
                          Select Duration
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setCurrentStep(2)}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        borderRadius: "12px",
                        background: currentStep === 2 ? "#0f172a" : "#ffffff",
                        border: currentStep === 2 ? "1.5px solid #0f172a" : "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: currentStep === 2 ? "0 4px 14px rgba(15, 23, 42, 0.12)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: currentStep === 2 ? "#c59b27" : "#e2e8f0",
                          color: currentStep === 2 ? "#ffffff" : "#475569",
                          fontSize: "11px",
                          fontWeight: "800",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        2
                      </span>
                      <div>
                        <div style={{ fontSize: "9px", fontWeight: "800", color: currentStep === 2 ? "#c59b27" : "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          STEP 2
                        </div>
                        <div style={{ fontSize: "13.5px", fontWeight: "700", color: currentStep === 2 ? "#ffffff" : "#0f172a" }}>
                          Your Details & Payment
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP CONTENT */}
                  {currentStep === 1 ? (
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
                        Select your membership plan duration:
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {PLANS.map((plan) => {
                          const isSelected = selectedPlanId === plan.id;
                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlanId(plan.id)}
                              style={{
                                background: "#ffffff",
                                border: isSelected ? "2px solid #0f172a" : "1px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "18px 20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                boxShadow: isSelected ? "0 4px 16px rgba(15, 23, 42, 0.06)" : "none",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <span style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                                    {plan.name}
                                  </span>
                                  {plan.badge && (
                                    <span style={{ background: "#c59b27", color: "#ffffff", fontSize: "9px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px" }}>
                                      {plan.badge}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "4px" }}>
                                  {plan.subtext}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>
                                    {plan.price}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    border: isSelected ? "6px solid #0f172a" : "2px solid #cbd5e1",
                                    background: "#ffffff",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        style={{
                          width: "100%",
                          padding: "14px 20px",
                          background: "#0f172a",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                          marginTop: "20px",
                          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.15)",
                          transition: "all 0.15s ease",
                        }}
                      >
                        Next: Enter Details & Payment &rarr;
                      </button>
                    </div>
                  ) : (
                    /* STEP 2: USER DETAILS & PAYMENT FORM */
                    <div>
                      <div
                        style={{
                          background: "#fffaf0",
                          border: "1.5px solid #f3e8c8",
                          borderRadius: "14px",
                          padding: "16px 20px",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "10px", fontWeight: "800", color: "#9a6b1f", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            SELECTED PLAN
                          </div>
                          <div style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                            {selectedPlan.name} ({selectedPlan.price})
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {selectedPlan.subtext}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#854d0e",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            textDecoration: "underline",
                            padding: 0,
                          }}
                        >
                          Change Plan
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "12.5px", color: "#475569", marginBottom: "6px", fontWeight: "600" }}>
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Rahul Sharma"
                            value={fullName}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "12.5px", color: "#475569", marginBottom: "6px", fontWeight: "600" }}>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="rahul@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "12.5px", color: "#475569", marginBottom: "6px", fontWeight: "600" }}>
                            Phone Number *
                          </label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              style={{
                                padding: "12px 10px",
                                borderRadius: "10px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                background: "#ffffff",
                                outline: "none",
                              }}
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.code} ({c.country})
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              required
                              placeholder="9876543210"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px 14px",
                                borderRadius: "10px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loadingPayment}
                          style={{
                            width: "100%",
                            padding: "14px 20px",
                            background: loadingPayment ? "#64748b" : "#0f172a",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "14.5px",
                            fontWeight: "700",
                            cursor: loadingPayment ? "not-allowed" : "pointer",
                            marginTop: "8px",
                            boxShadow: "0 4px 14px rgba(15, 23, 42, 0.15)",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {loadingPayment ? "Initializing Razorpay..." : `Pay ${selectedPlan.price} via Razorpay`}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 2: PAST PAYMENTS VIEW */}
      {mainTab === "past_payments" && (() => {
        const displayPayments = pastPayments;

        return (
          <div style={{ width: "100%" }}>
            {loadingPayments ? (
              <div style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "48px 0" }}>
                Loading payment records...
              </div>
            ) : displayPayments.length === 0 ? (
              <div style={{ fontSize: "13.5px", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "28px", borderRadius: "8px", textAlign: "center" }}>
                No past payment records found for this account.
              </div>
            ) : (
              <div style={{ width: "100%", overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#ffffff" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #e2e8f0", background: "#f8fafc" }}>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Plan</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment ID</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Expires</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayPayments.map((p, idx) => {
                    const isPaid = p.status === "paid";
                    const dateFormatted = p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";
                    const expiresFormatted = p.expiresAt
                      ? new Date(p.expiresAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";

                    return (
                      <tr
                        key={p.id || idx}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <td style={{ padding: "14px 16px", color: "#334155", fontWeight: "500", whiteSpace: "nowrap" }}>
                          {dateFormatted}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#0f172a", fontWeight: "700" }}>
                          {p.planName}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>
                          {p.paymentId || p.orderId || "-"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#854d0e", fontWeight: "600", whiteSpace: "nowrap" }}>
                          {expiresFormatted}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#0f172a", fontWeight: "700", whiteSpace: "nowrap" }}>
                          ₹ {Number(p.amount).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              padding: "3px 9px",
                              borderRadius: "9999px",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              background: isPaid ? "#dcfce7" : "#fef3c7",
                              color: isPaid ? "#166534" : "#92400e",
                              display: "inline-block",
                            }}
                          >
                            {isPaid ? "PAID" : p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    })()}

      </div>
    </div>
  );
}
