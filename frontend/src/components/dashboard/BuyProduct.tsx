"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Package,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Camera,
  Box,
  PenLine,
  Share2,
  LayoutList,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  removeFromCart,
  clearCart,
  applyPromo,
  clearPromo,
} from "@/store/slices/cartSlice";

// ── Mock cart data ─────────────────────────────────────────────────────────────
const itemUIConfigs: Record<
  string,
  {
    icon: any;
    iconBg: string;
    iconColor: string;
    badge: string;
    badgeColor: string;
  }
> = {
  "Featured Listing Boost": {
    icon: Zap,
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-500 dark:text-rose-400",
    badge: "Hot",
    badgeColor:
      "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  "Professional Photography": {
    icon: Camera,
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-500 dark:text-amber-400",
    badge: "Popular",
    badgeColor:
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  "3D Virtual Tour": {
    icon: Box,
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-500 dark:text-violet-400",
    badge: "New",
    badgeColor:
      "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },
  "Floor Plan Design": {
    icon: PenLine,
    iconBg: "bg-sky-50 dark:bg-sky-500/10",
    iconColor: "text-sky-500 dark:text-sky-400",
    badge: "Design",
    badgeColor:
      "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  },
  "Social Media Promotion": {
    icon: Share2,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    badge: "Best Value",
    badgeColor:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  "SEO Listing Copywriting": {
    icon: LayoutList,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    badge: "Expert",
    badgeColor:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
};

const paymentMethods = [
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard, UnionPay",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    icon: Banknote,
    desc: "JazzCash, EasyPaisa, HBL",
  },
  {
    id: "easypaisa",
    label: "Mobile Wallet",
    icon: Smartphone,
    desc: "JazzCash or EasyPaisa wallet",
  },
];

// ── Section card shell ─────────────────────────────────────────────────────────
function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
        {Icon && (
          <Icon className="w-4 h-4 text-royal-600 dark:text-royal-400" />
        )}
        <p className="text-[15px] font-bold text-slate-900 dark:text-white">
          {title}
        </p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function BuyProduct() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Local UI state for quantities (persisted during checkout session, but not globally needed)
  // Actually, let's keep it simple: since the app is service-based, quantity is usually 1.
  // We'll treat cartItems directly.

  const appliedPromoCode = useSelector(
    (state: RootState) => state.cart.appliedPromo,
  );
  const discountRate = useSelector(
    (state: RootState) => state.cart.discountRate,
  );

  const [payment, setPayment] = useState("card");
  const [promo, setPromo] = useState(appliedPromoCode || "");
  const [promoError, setPromoError] = useState(false);
  const [ordered, setOrdered] = useState(false);

  // Sync local input with applied code (e.g., when bundle item is removed)
  useEffect(() => {
    setPromo(appliedPromoCode || "");
  }, [appliedPromoCode]);

  const removeItem = (id: number) => dispatch(removeFromCart(id));

  const subtotal = cartItems.reduce((sum, i) => sum + i.price, 0);
  const discount = Math.round(subtotal * discountRate);
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + tax;

  const handlePromo = () => {
    const code = promo.trim().toUpperCase();
    if (code === "ROYAL10") {
      dispatch(applyPromo({ code: "ROYAL10", rate: 0.1 }));
      setPromoError(false);
    } else if (code === "ROYAL30") {
      dispatch(applyPromo({ code: "ROYAL30", rate: 0.3 }));
      setPromoError(false);
    } else {
      setPromoError(true);
      dispatch(clearPromo());
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-sm bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-[24px] font-bold text-slate-900 dark:text-white mb-2">
          Order Confirmed!
        </h2>
        <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 max-w-sm mb-6">
          Your order has been placed successfully. You'll receive a confirmation
          email shortly.
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 px-6 py-4 mb-6 text-left w-full max-w-xs">
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Order Summary
          </p>
          {cartItems.map((i) => (
            <div
              key={i.id}
              className="flex justify-between text-[14px] font-medium py-1 text-slate-700 dark:text-slate-300"
            >
              <span>{i.name}</span>
              <span className="font-bold">PKR {i.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2 flex justify-between text-[14px] font-extrabold text-slate-900 dark:text-white">
            <span>Total Paid</span>
            <span className="text-royal-700 dark:text-royal-400">
              PKR {total.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/order-history")}
            className="flex items-center gap-2 text-[14px] font-bold text-royal-600 dark:text-royal-400 border border-royal-200 dark:border-royal-500/30 px-5 py-2.5 rounded-sm hover:bg-royal-50 dark:hover:bg-royal-500/10 transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" /> View Orders
          </button>
          <button
            onClick={() => {
              dispatch(clearCart());
              router.push("/dashboard/props-shop");
            }}
            className="flex items-center gap-2 text-[14px] font-bold bg-royal-600 hover:bg-royal-700 text-white px-5 py-2.5 rounded-sm transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" /> Shop More
          </button>
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
          <ShoppingCart className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-[16px] font-bold text-slate-800 dark:text-slate-200 mb-1">
          Your cart is empty
        </p>
        <p className="text-[14px] font-medium text-slate-500 mb-5">
          Browse the Props Shop to add services.
        </p>
        <button
          onClick={() => router.push("/dashboard/props-shop")}
          className="flex items-center gap-2 text-[14px] font-bold bg-royal-600 hover:bg-royal-700 text-white px-5 py-2.5 rounded-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 dark:text-white">
            Checkout
          </h1>
          <p className="text-[14px] font-medium text-slate-500 mt-0.5">
            {cartItems.length} service{cartItems.length !== 1 ? "s" : ""} in
            your cart
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/props-shop")}
          className="flex items-center gap-2 text-[14px] font-bold text-slate-600 dark:text-slate-400 hover:text-royal-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
      </div>

      {/* ── Two-col layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        {/* LEFT — Cart + Payment ─────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">
          {/* Cart Items */}
          <Card title="Cart Items" icon={ShoppingCart}>
            <div className="space-y-0 -my-1">
              {cartItems.map((item, i) => {
                const config =
                  itemUIConfigs[item.name as keyof typeof itemUIConfigs];
                const Icon = config?.icon || Package;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 py-5 ${
                      i < cartItems.length - 1
                        ? "border-b border-slate-100 dark:border-slate-800"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 ${config?.iconBg || "bg-slate-50"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${config?.iconColor || "text-slate-500"}`}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[15px] font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        {config?.badge && (
                          <span
                            className={`text-[12px] font-bold px-2.5 py-0.5 rounded-sm border ${config.badgeColor}`}
                          >
                            {config.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-medium text-slate-500 mt-1 truncate">
                        {item.desc}
                      </p>
                      <p className="text-[15px] font-extrabold text-royal-700 dark:text-royal-400 mt-1.5">
                        PKR {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-sm text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Payment Method */}
          <Card title="Payment Method" icon={CreditCard}>
            <div className="space-y-2">
              {paymentMethods.map((m) => {
                const Icon = m.icon;
                const active = payment === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm border text-left transition-all cursor-pointer ${
                      active
                        ? "border-royal-500 bg-royal-50 dark:bg-royal-500/10 dark:border-royal-500/50"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                        active
                          ? "bg-royal-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[15px] font-bold ${active ? "text-royal-700 dark:text-royal-300" : "text-slate-800 dark:text-slate-200"}`}
                      >
                        {m.label}
                      </p>
                      <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                        {m.desc}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active
                          ? "border-royal-600 bg-royal-600"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Card details (shown when card is selected) */}
            {payment === "card" && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234  5678  9012  3456"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-royal-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-royal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="• • •"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-royal-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT — Order Summary ─────────────────────────────────────── */}
        <div className="space-y-4 sticky top-0 self-start">
          {/* Promo Code */}
          <Card title="Promo Code" icon={Tag}>
            <div className="flex gap-2">
              <input
                type="text"
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value);
                  setPromoError(false);
                }}
                placeholder='Try "ROYAL10"'
                className="flex-1 px-3.5 py-2.5 text-[13px] rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-royal-500 transition-colors"
              />
              <button
                onClick={handlePromo}
                className="px-4 py-2.5 text-[12.5px] font-semibold bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {appliedPromoCode && (
              <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-4 h-4" /> Promo applied —{" "}
                {discountRate * 100}% off!
              </p>
            )}
            {promoError && (
              <p className="text-[13px] font-medium text-rose-500 mt-2">
                Invalid code. Try{" "}
                <span className="font-bold border-b border-rose-500">
                  ROYAL10
                </span>
                .
              </p>
            )}
          </Card>

          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Package className="w-4 h-4 text-royal-600 dark:text-royal-400" />
              <p className="text-[15px] font-bold text-slate-900 dark:text-white">
                Order Summary
              </p>
            </div>
            <div className="p-5 space-y-0">
              {/* Line items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </p>
                  </div>
                  <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0">
                    PKR {item.price.toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Totals */}
              <div className="pt-3 space-y-2">
                <div className="flex justify-between text-[14px] font-medium text-slate-600">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                {appliedPromoCode && (
                  <div className="flex justify-between text-[14px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span>Promo ({appliedPromoCode})</span>
                    <span>− PKR {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[14px] font-medium text-slate-600">
                  <span>Tax (5%)</span>
                  <span>PKR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[16px] text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total</span>
                  <span className="text-royal-700 dark:text-royal-400">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setOrdered(true)}
                className="w-full flex items-center justify-center gap-2 bg-royal-600 hover:bg-royal-700 text-white font-bold text-[15px] py-3 rounded-sm transition-colors cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                Confirm & Pay — PKR {total.toLocaleString()}
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Trust badge */}
              <p className="flex items-center justify-center gap-2 text-[13px] font-medium text-slate-500 mt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secured by SSL · 100% Safe Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
