"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { createOrder, type CreateOrderPayload } from "@/app/features/order/api";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearCart, decreaseQuantity, increaseQuantity, removeItem } from "@/app/store/slices/cartSlice";

type CheckoutFormState = {
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  paymentMethod: "cash" | "card" | "online";
  tableNumber: string;
};

const initialCheckoutForm: CheckoutFormState = {
  customerName: "",
  phone: "",
  email: "",
  deliveryAddress: "",
  orderType: "DINE_IN",
  paymentMethod: "cash",
  tableNumber: "",
};

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(initialCheckoutForm);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const itemCount = useMemo(
    () => cart.items.reduce((total, item) => total + item.quantity, 0),
    [cart.items]
  );

  const orderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      dispatch(clearCart());
      setCheckoutSuccess("Order submitted successfully.");
      setCheckoutError(null);
      setCheckoutForm(initialCheckoutForm);
    },
    onError: (mutationError: Error) => {
      setCheckoutSuccess(null);
      setCheckoutError(mutationError.message || "Failed to submit order.");
    },
  });

  const handleCheckoutSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutError(null);
    setCheckoutSuccess(null);

    if (!checkoutForm.customerName.trim()) {
      setCheckoutError("Customer name is required.");
      return;
    }

    if (cart.items.length === 0) {
      setCheckoutError("Please add at least one menu item to cart.");
      return;
    }

    if (checkoutForm.orderType === "DELIVERY" && !checkoutForm.deliveryAddress.trim()) {
      setCheckoutError("Delivery address is required for delivery orders.");
      return;
    }

    if (checkoutForm.orderType === "DINE_IN" && !checkoutForm.tableNumber) {
      setCheckoutError("Table number is required for dine-in orders.");
      return;
    }

    const payload: CreateOrderPayload = {
      customerName: checkoutForm.customerName,
      phone: checkoutForm.phone || undefined,
      email: checkoutForm.email || undefined,
      deliveryAddress:
        checkoutForm.orderType === "DELIVERY" ? checkoutForm.deliveryAddress : undefined,
      orderType: checkoutForm.orderType,
      paymentMethod: checkoutForm.paymentMethod,
      tableNumber:
        checkoutForm.orderType === "DINE_IN" ? Number(checkoutForm.tableNumber) : undefined,
      items: cart.items.map((cartItem) => ({
        menuItemId: cartItem.menuItemId,
        quantity: cartItem.quantity,
      })),
    };

    orderMutation.mutate(payload);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/35 z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[75] shadow-2xl border-l border-black/10 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <header className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-[#1a5a46]" />
              <h2 className="text-lg font-black text-[#1a5a46]">Cart ({itemCount})</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center"
              aria-label="Close cart"
            >
              <X size={16} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cart.items.length === 0 ? (
              <p className="text-sm text-black/55">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {cart.items.map((cartItem) => (
                  <div key={cartItem.menuItemId} className="rounded-xl border border-black/10 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-black">{cartItem.name}</p>
                        <p className="text-xs text-black/55">NPR {cartItem.price.toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(cartItem.menuItemId))}
                        className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-3 inline-flex items-center rounded-lg border border-black/15 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => dispatch(decreaseQuantity(cartItem.menuItemId))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{cartItem.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(increaseQuantity(cartItem.menuItemId))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/5"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="font-bold text-black mb-4">Total: NPR {cart.totalPrice.toFixed(2)}</p>

            <form className="space-y-3" onSubmit={handleCheckoutSubmit}>
              <input
                type="text"
                placeholder="Customer name"
                value={checkoutForm.customerName}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({ ...prev, customerName: event.target.value }))
                }
                className="w-full rounded-xl border border-black/15 px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={checkoutForm.phone}
                onChange={(event) => setCheckoutForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="w-full rounded-xl border border-black/15 px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={checkoutForm.email}
                onChange={(event) => setCheckoutForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-black/15 px-3 py-2"
              />

              <select
                value={checkoutForm.orderType}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    orderType: event.target.value as CheckoutFormState["orderType"],
                  }))
                }
                className="w-full rounded-xl border border-black/15 px-3 py-2"
              >
                <option value="DINE_IN">DINE_IN</option>
                <option value="TAKEAWAY">TAKEAWAY</option>
                <option value="DELIVERY">DELIVERY</option>
              </select>

              {checkoutForm.orderType === "DINE_IN" && (
                <input
                  type="number"
                  placeholder="Table number"
                  value={checkoutForm.tableNumber}
                  onChange={(event) =>
                    setCheckoutForm((prev) => ({ ...prev, tableNumber: event.target.value }))
                  }
                  className="w-full rounded-xl border border-black/15 px-3 py-2"
                />
              )}

              {checkoutForm.orderType === "DELIVERY" && (
                <input
                  type="text"
                  placeholder="Delivery address"
                  value={checkoutForm.deliveryAddress}
                  onChange={(event) =>
                    setCheckoutForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))
                  }
                  className="w-full rounded-xl border border-black/15 px-3 py-2"
                />
              )}

              <select
                value={checkoutForm.paymentMethod}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    paymentMethod: event.target.value as CheckoutFormState["paymentMethod"],
                  }))
                }
                className="w-full rounded-xl border border-black/15 px-3 py-2"
              >
                <option value="cash">cash</option>
                <option value="card">card</option>
                <option value="online">online</option>
              </select>

              {checkoutError && <p className="text-sm text-red-600">{checkoutError}</p>}
              {checkoutSuccess && <p className="text-sm text-green-700">{checkoutSuccess}</p>}

              <button
                type="submit"
                disabled={orderMutation.isPending}
                className="w-full rounded-xl bg-[#1a5a46] text-white py-2.5 font-semibold disabled:opacity-50"
              >
                {orderMutation.isPending ? "Submitting..." : "Submit order"}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
