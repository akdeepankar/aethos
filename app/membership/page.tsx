"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/auth-context";

interface Plan {
  id: string;
  name: string;
  price: string;
  amount: number; // in INR
  billingPeriod: string;
  subtext: string;
  badge?: string;
  savings?: string;
}

const PLANS: Plan[] = [
  {
    id: "3_months",
    name: "3 Months",
    price: "₹ 4,500",
    amount: 4500,
    billingPeriod: "per 3 months",
    subtext: "₹1,500 / month",
  },
  {
    id: "6_months",
    name: "6 Months",
    price: "₹ 7,500",
    amount: 7500,
    billingPeriod: "per 6 months",
    subtext: "₹1,250 / month",
    savings: "SAVE ₹1,500",
  },
  {
    id: "1_year",
    name: "Annual Pass",
    price: "₹ 12,000",
    amount: 12000,
    billingPeriod: "per year",
    subtext: "₹1,000 / month",
    badge: "BEST VALUE",
    savings: "33% OFF",
  },
];

const INCLUDED_PERKS = [
  {
    title: "2-3 Stock Deep Dives / month",
    desc: "In-depth fundamental research notes with financial models.",
  },
  {
    title: "2 Thematic & Sectoral Primers",
    desc: "Structural sector megatrends and macroeconomic primers.",
  },
  {
    title: "IPO Deep Dive Notes & Tracker",
    desc: "Comprehensive pre-listing analysis and valuation breakdowns.",
  },
  {
    title: "Scuttlebutt & Concall Analysis",
    desc: "On-ground channel checks and earnings conference notes.",
  },
  {
    title: "Full Research Archive Access",
    desc: "Unrestricted access to all past notes, models & memos.",
  },
  {
    title: "Live Market Pulse & Alerts",
    desc: "Timely alerts on critical regulatory & company disclosures.",
  },
];

const COUNTRY_CODES = [
  { code: "+91", country: "IN", label: "IN +91" },
  { code: "+1", country: "US", label: "US +1" },
  { code: "+44", country: "UK", label: "UK +44" },
  { code: "+971", country: "UAE", label: "UAE +971" },
  { code: "+65", country: "SG", label: "SG +65" },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MembershipPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [mainTab, setMainTab] = useState<"membership" | "past_payments">("membership");
  const [showPlanModal, setShowPlanModal] = useState<boolean>(true);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState<{
    isOpen: boolean;
    paymentId: string;
    orderId?: string;
    planName: string;
    amount: number;
  } | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("1_year");
  const [fullName, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponMsg, setCouponMsg] = useState<string>("");

  const [showGst, setShowGst] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [showPriceBreakdown, setShowPriceBreakdown] = useState<boolean>(false);

  const [paymentError, setPaymentError] = useState<string>("");
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
  const finalAmount = Math.max(0, selectedPlan.amount - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === "AETHOS10" || code === "WELCOME10") {
      const disc = Math.round(selectedPlan.amount * 0.1);
      setCouponDiscount(disc);
      setCouponApplied(true);
      setCouponMsg(`✓ 10% off applied (-₹${disc.toLocaleString("en-IN")})`);
    } else if (code === "SPECIAL20") {
      const disc = Math.round(selectedPlan.amount * 0.2);
      setCouponDiscount(disc);
      setCouponApplied(true);
      setCouponMsg(`✓ 20% off applied (-₹${disc.toLocaleString("en-IN")})`);
    } else {
      setCouponDiscount(0);
      setCouponApplied(false);
      setCouponMsg("Invalid coupon code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    setLoadingPayment(true);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          customerName: fullName,
          customerEmail: email,
          customerPhone: `${countryCode}${phoneNumber}`,
          userId: user?.$id || (user as any)?.id || "",
          notes: {
            gstNumber: gstNumber || undefined,
            companyName: companyName || undefined,
            couponCode: couponApplied ? couponCode : undefined,
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setPaymentError(data.error || "Failed to initialize payment. Please try again.");
        setLoadingPayment(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Aethos Wealth",
        description: `${selectedPlan.name} Membership`,
        order_id: data.orderId,
        customer_id: data.customerId || undefined,
        prefill: {
          name: fullName,
          email: email,
          contact: `${countryCode}${phoneNumber}`,
        },
        theme: {
          color: "#c59b27",
        },
        handler: async function (response: any) {
          try {
            const durationDays = selectedPlan.id === "3_months" ? 90 : selectedPlan.id === "6_months" ? 180 : 365;
            const calculatedExpiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

            const optimisticPayment = {
              id: response.razorpay_payment_id || `pay_${Date.now()}`,
              orderId: response.razorpay_order_id || "",
              paymentId: response.razorpay_payment_id || "PAID",
              planId: selectedPlan.id,
              planName: selectedPlan.name,
              amount: finalAmount,
              status: "PAID",
              createdAt: new Date().toISOString(),
              expiresAt: calculatedExpiry,
              customerName: fullName,
              customerEmail: email,
              customerPhone: `${countryCode}${phoneNumber}`,
            };

            setPastPayments((prev) => [optimisticPayment, ...prev]);
            setShowPlanModal(false);
            setPaymentSuccessModal({
              isOpen: true,
              paymentId: response.razorpay_payment_id || "PAID",
              orderId: response.razorpay_order_id || "",
              planName: selectedPlan.name,
              amount: finalAmount,
            });

            await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                amount: finalAmount,
                customerName: fullName,
                customerEmail: email,
                customerPhone: `${countryCode}${phoneNumber}`,
                userId: user?.$id || (user as any)?.id || "",
              }),
            });

            await fetchPastPayments();
            router.refresh();
          } catch (vErr) {
            console.error("Verification error:", vErr);
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
        setPaymentError("Razorpay SDK failed to load. Please check your internet connection.");
        setLoadingPayment(false);
      }
    } catch (err: any) {
      console.error("Payment trigger error:", err);
      setPaymentError(err.message || "Payment trigger failed. Please try again.");
      setLoadingPayment(false);
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
          background: "#FAF8F5",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#c59b27",
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
            color: "#854d0e",
            letterSpacing: "0.02em",
          }}
        >
          Loading membership details...
        </div>
      </div>
    );
  }

  const latestPaidPayment = pastPayments.find(
    (p) => p.status === "paid" || p.status === "PAID"
  );
  const hasExpiry = Boolean(latestPaidPayment?.expiresAt);
  const expiresTime = hasExpiry ? new Date(latestPaidPayment.expiresAt).getTime() : 0;
  const now = Date.now();
  const isPaidMember = Boolean(latestPaidPayment && hasExpiry && expiresTime > now);

  /* =========================================================================
     FREE / NON-PAID USER: MINIMAL FULL COVER SCREEN MODAL
     - Consistent outside labels on all 3 columns
     - Column 1: WHAT'S INCLUDED (Every perk filled in its own sleek mini card)
     - Column 2: CHOOSE A PLAN (Tall, full-height plan selection buttons)
     - Column 3: YOUR DETAILS & CHECKOUT (Button pinned to bottom)
     - Beautiful minimal aesthetic fitting 100vh
     ========================================================================= */
  if (!isPaidMember && showPlanModal && !paymentSuccessModal?.isOpen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: "#FAF8F5",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: "#0f172a",
        }}
      >
        <style jsx global>{`
          .modal-viewport-container {
            flex: 1;
            display: flex;
            align-items: center;
            justifyContent: center;
            max-width: 1260px;
            width: 100%;
            margin: 0 auto;
            padding: 12px 28px 24px;
            box-sizing: border-box;
            height: calc(100vh - 58px);
          }
          .modal-3col-layout {
            display: grid;
            grid-template-columns: 1.05fr 1fr 1.1fr;
            gap: 20px;
            align-items: stretch;
            width: 100%;
            height: 100%;
            max-height: 560px;
          }
          .col-outer-wrap {
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: 100%;
          }
          .perk-mini-card {
            flex: 1;
            background: #ffffff;
            border: 1px solid #e8e2d8;
            border-radius: 12px;
            padding: 9px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.01);
            transition: all 0.15s ease;
          }
          .perk-mini-card:hover {
            border-color: #c59b27;
            transform: translateX(1px);
            box-shadow: 0 2px 8px rgba(197, 155, 39, 0.06);
          }
          .minimal-panel {
            flex: 1;
            background: #ffffff;
            border: 1px solid #e8e2d8;
            border-radius: 18px;
            padding: 22px 24px;
            display: flex;
            flex-direction: column;
            justifyContent: space-between;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
            box-sizing: border-box;
            height: calc(100% - 24px);
          }
          .plan-tall-btn {
            flex: 1;
            background: #ffffff;
            border: 1.5px solid #e8e2d8;
            border-radius: 14px;
            padding: 18px 20px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            justifyContent: space-between;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
            position: relative;
          }
          .plan-tall-btn:hover {
            border-color: #c59b27;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(197, 155, 39, 0.08);
          }
          .plan-tall-btn.selected {
            border: 2px solid #c59b27;
            background: #fffdf9;
            box-shadow: 0 6px 22px rgba(197, 155, 39, 0.12);
          }
          .gold-radio {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #cbd5e1;
            display: flex;
            align-items: center;
            justifyContent: center;
            transition: all 0.15s ease;
            flex-shrink: 0;
          }
          .plan-tall-btn.selected .gold-radio {
            border-color: #c59b27;
            background: #ffffff;
          }
          .gold-radio-inner {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #c59b27;
          }
          .minimal-input {
            width: 100%;
            background: #FAF8F5;
            border: 1px solid #e8e2d8;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 13.5px;
            color: #0f172a;
            outline: none;
            transition: all 0.15s ease;
            box-sizing: border-box;
          }
          .minimal-input:focus {
            border-color: #c59b27;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(197, 155, 39, 0.1);
          }
          .minimal-input::placeholder {
            color: #a1a1aa;
          }
          .btn-gold-inline {
            background: #FAF8F5;
            border: 1px solid #e8e2d8;
            border-radius: 8px;
            padding: 0 14px;
            font-size: 12.5px;
            font-weight: 600;
            color: #854d0e;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .btn-gold-inline:hover {
            background: #fefce8;
            border-color: #c59b27;
          }
          @keyframes shinePulse {
            0% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6), 0 0 16px rgba(16, 185, 129, 0.35);
              transform: scale(0.96);
            }
            50% {
              box-shadow: 0 0 0 18px rgba(16, 185, 129, 0), 0 0 32px rgba(16, 185, 129, 0.5);
              transform: scale(1.04);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0), 0 0 16px rgba(16, 185, 129, 0.35);
              transform: scale(0.96);
            }
          }
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.9) translateY(16px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @media (max-width: 1024px) {
            .modal-viewport-container {
              height: auto;
              overflow-y: auto;
            }
            .modal-3col-layout {
              grid-template-columns: 1fr;
              max-height: none;
              gap: 20px;
            }
            .minimal-panel {
              height: auto;
            }
            .plan-tall-btn {
              min-height: 100px;
            }
          }
        `}</style>

        {/* MINIMAL TOP BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 32px",
            borderBottom: "1px solid #ece7df",
            background: "#FAF8F5",
            flexShrink: 0,
            height: "58px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "0.12em", color: "#0f172a" }}>
              AETHOS
            </span>
            <div style={{ width: "1px", height: "14px", background: "#cbd5e1" }} />
            <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", color: "#c59b27", textTransform: "uppercase" }}>
              MEMBERSHIP PASS
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowPlanModal(false)}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#475569",
              transition: "all 0.15s ease",
            }}
            title="Close"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 3-COLUMN VIEWPORT CONTENT */}
        <div className="modal-viewport-container">
          <div className="modal-3col-layout">

            {/* COLUMN 1: WHAT'S INCLUDED (EACH PERK INSIDE ITS OWN CARD, FILLING HEIGHT) */}
            <div className="col-outer-wrap">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "0.12em",
                  color: "#c59b27",
                  textTransform: "uppercase",
                  paddingLeft: "2px",
                }}
              >
                WHAT&apos;S INCLUDED
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, height: "calc(100% - 24px)" }}>
                {INCLUDED_PERKS.map((item, idx) => (
                  <div key={idx} className="perk-mini-card">
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#fefce8",
                        border: "1px solid #fde047",
                        color: "#c59b27",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "800",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", lineHeight: "1.2" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", lineHeight: "1.25" }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: CHOOSE A PLAN */}
            <div className="col-outer-wrap">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "0.12em",
                  color: "#c59b27",
                  textTransform: "uppercase",
                  paddingLeft: "2px",
                }}
              >
                CHOOSE A PLAN
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, height: "calc(100% - 24px)" }}>
                {PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`plan-tall-btn ${isSelected ? "selected" : ""}`}
                    >
                      {/* TOP ROW: NAME & BADGE & RADIO */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                fontFamily: "Georgia, 'Times New Roman', serif",
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#0f172a",
                              }}
                            >
                              {plan.name}
                            </span>

                            {plan.badge && (
                              <span
                                style={{
                                  background: "#c59b27",
                                  color: "#ffffff",
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  letterSpacing: "0.06em",
                                  padding: "2px 7px",
                                  borderRadius: "9999px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {plan.badge}
                              </span>
                            )}

                            {plan.savings && (
                              <span
                                style={{
                                  background: "#fef3c7",
                                  color: "#92400e",
                                  border: "1px solid #fde68a",
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  letterSpacing: "0.04em",
                                  padding: "1px 6px",
                                  borderRadius: "9999px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {plan.savings}
                              </span>
                            )}
                          </div>

                          <div className="gold-radio">
                            {isSelected && <div className="gold-radio-inner" />}
                          </div>
                        </div>

                        {/* PRICE */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
                          <span
                            style={{
                              fontFamily: "Georgia, 'Times New Roman', serif",
                              fontSize: "24px",
                              fontWeight: "700",
                              color: "#0f172a",
                            }}
                          >
                            {plan.price}
                          </span>
                          <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "500" }}>
                            {plan.billingPeriod}
                          </span>
                        </div>
                      </div>

                      {/* SUBTEXT / PER MONTH */}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#854d0e",
                          fontFamily: "monospace",
                          fontWeight: "600",
                          marginTop: "6px",
                        }}
                      >
                        {plan.subtext}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: YOUR DETAILS & CHECKOUT (BUTTON PINNED TO BOTTOM) */}
            <div className="col-outer-wrap">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "0.12em",
                  color: "#c59b27",
                  textTransform: "uppercase",
                  paddingLeft: "2px",
                }}
              >
                YOUR DETAILS & CHECKOUT
              </div>

              <div className="minimal-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                  {/* UPPER INPUTS SECTION */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#475569", marginBottom: "3px", fontWeight: "600" }}>
                        Full name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Devesh Kedia"
                        value={fullName}
                        onChange={(e) => setName(e.target.value)}
                        className="minimal-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#475569", marginBottom: "3px", fontWeight: "600" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="minimal-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#475569", marginBottom: "3px", fontWeight: "600" }}>
                        Phone *
                      </label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          style={{
                            width: "88px",
                            background: "#FAF8F5",
                            border: "1px solid #e8e2d8",
                            borderRadius: "8px",
                            padding: "8px 6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#0f172a",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="minimal-input"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    {/* ADD GST DETAILS */}
                    <div style={{ borderTop: "1px solid #f1f0eb", paddingTop: "8px", marginTop: "2px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showGst ? "8px" : "0px" }}>
                        <button
                          type="button"
                          onClick={() => setShowGst(!showGst)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            fontSize: "12px",
                            color: "#854d0e",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span style={{ fontSize: "14px", lineHeight: 1 }}>{showGst ? "−" : "+"}</span>
                          <span>{showGst ? "Remove GST Details" : "Add GST details (Optional)"}</span>
                        </button>
                      </div>

                      {showGst && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10.5px", color: "#475569", marginBottom: "3px", fontWeight: "600" }}>
                              Company Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Acme Capital Ltd"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="minimal-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10.5px", color: "#475569", marginBottom: "3px", fontWeight: "600" }}>
                              GSTIN Number
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 27AAAAA0000A1Z5"
                              value={gstNumber}
                              onChange={(e) => setGstNumber(e.target.value)}
                              className="minimal-input"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM PINNED CHECKOUT BUTTON SECTION */}
                  <div style={{ marginTop: "auto", paddingTop: "12px" }}>
                    {paymentError && (
                      <div
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#dc2626",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          textAlign: "center",
                        }}
                      >
                        {paymentError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loadingPayment}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        background: loadingPayment
                          ? "#94a3b8"
                          : "linear-gradient(135deg, #c59b27 0%, #b8860b 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "13.5px",
                        fontWeight: "800",
                        letterSpacing: "0.02em",
                        cursor: loadingPayment ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 14px rgba(197, 155, 39, 0.22)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {loadingPayment ? "Initializing Razorpay..." : `Pay ₹${finalAmount.toLocaleString("en-IN")} via Razorpay →`}
                    </button>

                    <div style={{ textAlign: "center", fontSize: "10px", color: "#8c827a", marginTop: "4px" }}>
                      🔒 256-bit SSL Secure Checkout • Powered by Razorpay
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     PAID MEMBER VIEW: ACTIVE MEMBER PASS & PAST PAYMENTS TAB
     ========================================================================= */
  return (
    <div
      style={{
        width: "100%",
        color: "#0f172a",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <style jsx global>{`
        @media (max-width: 868px) {
          .membership-header-nav {
            padding: 0 16px !important;
          }
          .membership-content-container {
            padding: 0 16px 40px !important;
          }
          .membership-main-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
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
          className="membership-header-nav"
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
                    borderBottom: isActive ? "2px solid #c59b27" : "2px solid transparent",
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
        className="membership-content-container"
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {/* TAB 1: ACTIVE MEMBERSHIP PASS */}
        {mainTab === "membership" && (
          <div
            className="membership-main-grid"
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
                  {user ? (user.name || user.email) : "Active Member"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: "1.4" }}>
                  Full access to institutional research, financial models, and scuttlebutt notes.
                </div>
              </div>

              {/* PERFORATED DOTTED TICKET DIVIDER */}
              <div style={{ position: "relative", margin: "4px 0" }}>
                <div style={{ borderTop: "2px dashed #cbd5e1", width: "100%" }} />
                <div style={{ position: "absolute", left: "-10px", top: "-10px", width: "20px", height: "20px", borderRadius: "50%", background: "#f8fafc", borderRight: "1px solid #e2e8f0" }} />
                <div style={{ position: "absolute", right: "-10px", top: "-10px", width: "20px", height: "20px", borderRadius: "50%", background: "#f8fafc", borderLeft: "1px solid #e2e8f0" }} />
              </div>

              {/* TICKET LOWER DETAILS BODY */}
              <div style={{ padding: "16px 18px 20px", background: "#ffffff", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Status</span>
                    <span style={{ fontWeight: "700", color: isPaidMember ? "#16a34a" : "#ca8a04" }}>
                      {isPaidMember ? "Active Member" : "Free Member"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Plan Tier</span>
                    <span style={{ fontWeight: "700", color: "#0f172a" }}>
                      {isPaidMember ? (latestPaidPayment?.planName || "Annual Pass") : "Free Tier"}
                    </span>
                  </div>

                  {isPaidMember && hasExpiry && latestPaidPayment?.expiresAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748b" }}>Expires</span>
                      <span style={{ fontWeight: "700", color: "#854d0e" }}>
                        {new Date(latestPaidPayment.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Billing</span>
                    <span style={{ fontWeight: "500", color: "#0f172a" }}>
                      {isPaidMember ? "One-Time" : "Complimentary"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Library</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {isPaidMember ? "Unlimited" : "Limited (Free Research)"}
                    </span>
                  </div>
                </div>

                {/* TICKET DECORATIVE BARCODE */}
                <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "3px", justifyContent: "center", alignItems: "center", height: "28px", opacity: 0.65, marginBottom: "6px" }}>
                    {[3,1,2,4,1,3,2,1,4,2,1,3,1,2,4,2,1,3,2,1].map((w, i) => (
                      <div key={i} style={{ width: `${w}px`, height: "100%", background: "#0f172a" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#94a3b8", letterSpacing: "0.15em" }}>
                    {user?.$id ? `ATH-${user.$id.slice(-8).toUpperCase()}` : "ATH-PASS"}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: ACTIVE / UPGRADE PASS DETAILS */}
            <div style={{ width: "100%", height: "100%" }}>
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
                      background: isPaidMember ? "#dcfce7" : "#fef3c7",
                      color: isPaidMember ? "#166534" : "#92400e",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      letterSpacing: "0.06em",
                    }}
                  >
                    • {isPaidMember ? "ACTIVE" : "FREE ACCESS"}
                  </span>
                </div>

                {/* TICKET MAIN BODY */}
                <div style={{ padding: "24px", position: "relative" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#854d0e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {isPaidMember ? "CURRENT ACTIVE PLAN" : "MEMBERSHIP STATUS"}
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                    {isPaidMember ? (latestPaidPayment?.planName || "Membership Pass") : "Free Community Access"}
                  </div>
                  <div style={{ fontSize: "13.5px", color: "#64748b" }}>
                    {isPaidMember ? (
                      <>Your subscription is active and valid until <strong style={{ color: "#0f172a" }}>{new Date(latestPaidPayment.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong>.</>
                    ) : (
                      <>You are currently exploring on a free account. Upgrade to an institutional pass to unlock all financial models, deep dive notes, and concall analyses.</>
                    )}
                  </div>
                </div>

                {/* PERFORATED DOTTED TICKET DIVIDER */}
                <div style={{ position: "relative", margin: "4px 0" }}>
                  <div style={{ borderTop: "2px dashed #cbd5e1", width: "100%" }} />
                  <div style={{ position: "absolute", left: "-10px", top: "-10px", width: "20px", height: "20px", borderRadius: "50%", background: "#f8fafc", borderRight: "1px solid #e2e8f0" }} />
                  <div style={{ position: "absolute", right: "-10px", top: "-10px", width: "20px", height: "20px", borderRadius: "50%", background: "#f8fafc", borderLeft: "1px solid #e2e8f0" }} />
                </div>

                {/* TICKET LOWER BODY */}
                <div style={{ padding: "24px", background: "#fffaf0" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "#854d0e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                    {isPaidMember ? "INCLUDED IN YOUR ACTIVE PASS" : "WHAT PRO MEMBERSHIP INCLUDES"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    {INCLUDED_PERKS.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                        <span style={{ color: "#c59b27", fontWeight: "bold" }}>✓</span>
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ paddingTop: "16px", borderTop: "1px solid #f3e8c8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#0f172a" }}>
                        {isPaidMember ? `ORDER ID: ${latestPaidPayment?.paymentId || latestPaidPayment?.orderId || "PAID"}` : "PRO MEMBERSHIP UPGRADE"}
                      </div>
                      <div style={{ fontSize: "9.5px", color: "#854d0e", marginTop: "2px" }}>
                        {isPaidMember ? "VERIFIED BY RAZORPAY • ONE-TIME CHECKOUT" : "INSTANT ACCESS • 256-BIT ENCRYPTED"}
                      </div>
                    </div>

                    {!isPaidMember && (
                      <button
                        type="button"
                        onClick={() => setShowPlanModal(true)}
                        style={{
                          background: "#c59b27",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(197, 155, 39, 0.25)",
                        }}
                      >
                        Choose Plan →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAST PAYMENTS VIEW */}
        {mainTab === "past_payments" && (
          <div style={{ width: "100%" }}>
            {loadingPayments ? (
              <div style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "48px 0" }}>
                Loading payment records...
              </div>
            ) : pastPayments.length === 0 ? (
              <div style={{ fontSize: "13.5px", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "28px", borderRadius: "8px", textAlign: "center" }}>
                No past payment records found for this account.
              </div>
            ) : (
              <div style={{ width: "100%", overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#ffffff" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #e2e8f0", background: "#f8fafc" }}>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase" }}>Date</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase" }}>Plan</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase" }}>Payment ID</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase" }}>Expires</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase" }}>Amount</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", fontSize: "11.5px", textTransform: "uppercase", textAlign: "right" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastPayments.map((p, idx) => {
                      const isPaid = p.status === "paid";
                      const dateFormatted = p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "-";
                      const expiresFormatted = p.expiresAt
                        ? new Date(p.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "-";

                      return (
                        <tr key={p.id || idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
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
        )}
      </div>

      {/* ── Success Celebration Modal ── */}
      {paymentSuccessModal?.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPaymentSuccessModal(null);
              setShowPlanModal(false);
              setMainTab("membership");
            }
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              maxWidth: "460px",
              width: "100%",
              padding: "36px 28px 28px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.03)",
              position: "relative",
              animation: "popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => {
                setPaymentSuccessModal(null);
                setShowPlanModal(false);
                setMainTab("membership");
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
                transition: "all 0.15s ease",
              }}
              title="Close"
            >
              ✕
            </button>

            {/* Shining Green Tick Icon */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                color: "#ffffff",
                animation: "shinePulse 2.4s infinite ease-in-out",
                border: "3px solid #d1fae5",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Badge */}
            <div
              style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: "9999px",
                background: "#ecfdf5",
                color: "#047857",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              ✓ Payment Verified & Active
            </div>

            {/* Heading */}
            <h2
              style={{
                fontSize: "23px",
                fontWeight: "800",
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#0f172a",
                margin: "0 0 8px",
                lineHeight: "1.25",
              }}
            >
              Welcome to Aethos Wealth Membership
            </h2>

            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: "1.55", margin: "0 0 20px" }}>
              Your payment has been successfully confirmed. You now have full institutional access to deep dives, valuation models, concall trackers, and real-time ideas.
            </p>

            {/* Payment Summary Box */}
            <div
              style={{
                background: "#FAF8F5",
                border: "1px solid #ece7df",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "13px" }}>
                <span style={{ color: "#64748b" }}>Membership Plan:</span>
                <span style={{ fontWeight: "700", color: "#0f172a" }}>{paymentSuccessModal.planName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "13px" }}>
                <span style={{ color: "#64748b" }}>Amount Paid:</span>
                <span style={{ fontWeight: "800", color: "#0f172a" }}>₹{paymentSuccessModal.amount.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                <span style={{ color: "#64748b" }}>Payment ID:</span>
                <span style={{ fontFamily: "monospace", color: "#0f172a", fontWeight: "600", fontSize: "11.5px" }}>
                  {paymentSuccessModal.paymentId}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href="/research"
                onClick={() => {
                  setPaymentSuccessModal(null);
                  setShowPlanModal(false);
                }}
                style={{
                  display: "block",
                  padding: "12px 20px",
                  background: "#0f172a",
                  color: "#ffffff",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
                }}
              >
                Explore Research Library →
              </Link>
              <button
                type="button"
                onClick={() => {
                  setPaymentSuccessModal(null);
                  setShowPlanModal(false);
                  setMainTab("membership");
                }}
                style={{
                  padding: "10px 20px",
                  background: "#ffffff",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                View Membership Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
