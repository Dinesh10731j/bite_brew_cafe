"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, Trash2, X, MapPin, User, Mail, Phone } from "lucide-react";
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
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(initialCheckoutForm);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Seed the checkout form from the logged-in user when it changes.
  // Uses render-time adjustment (not an effect) to avoid setState-in-effect warnings.
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (isAuthenticated && user) {
      setCheckoutForm(prev => ({
        ...prev,
        customerName: user.name || "",
        email: user.email || ""
      }));
    }
  }

  const itemCount = useMemo(
    () => cart.items.reduce((total, item) => total + item.quantity, 0),
    [cart.items]
  );

  const orderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      dispatch(clearCart());
      setCheckoutSuccess("Order placed. Welcome to the dark side.");
      setCheckoutError(null);
      setTimeout(() => {
        setCheckoutSuccess(null);
        onClose();
      }, 3000);
    },
onError: (error: Error) => {
      setCheckoutError(error.message || "Something went wrong.");
    },
  });

const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    // Validation
    if (cart.items.length === 0) return setCheckoutError("Your cart is empty");
    if (!checkoutForm.customerName.trim()) return setCheckoutError("Name is required");
    if (!checkoutForm.phone.trim()) return setCheckoutError("Phone number is required");
    if (!checkoutForm.email.trim()) return setCheckoutError("Email is required");
    
    // Conditional Validation
    if (checkoutForm.orderType === "DINE_IN" && !checkoutForm.tableNumber) {
        return setCheckoutError("Please provide a table number");
    }
    if (checkoutForm.orderType === "DELIVERY" && !checkoutForm.deliveryAddress) {
        return setCheckoutError("Delivery address is required");
    }

    const payload: CreateOrderPayload = {
      ...checkoutForm,
      tableNumber: checkoutForm.orderType === "DINE_IN" ? Number(checkoutForm.tableNumber) : undefined,
      items: cart.items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }))
    };
    
    orderMutation.mutate(payload);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-black z-[75] border-l border-white/10 transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col text-white">
          <header className="px-6 py-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Your Order</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{itemCount} Items Selected</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
            {/* Cart Items Section */}
            <section className="space-y-4">
                {cart.items.length === 0 ? (
                  <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-white/20 italic font-bold uppercase">The void is empty</p>
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <div key={item.menuItemId} className="group bg-[#111] border border-white/5 rounded-3xl p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black uppercase italic text-sm">{item.name}</h4>
                          <p className="text-xs text-white/40 tracking-wider">NPR {item.price}</p>
                        </div>
                        <button 
                          onClick={() => dispatch(removeItem(item.menuItemId))}
                          className="text-white/20 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-black border border-white/10 rounded-xl">
                          <button onClick={() => dispatch(decreaseQuantity(item.menuItemId))} className="p-2"><Minus size={14}/></button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => dispatch(increaseQuantity(item.menuItemId))} className="p-2"><Plus size={14}/></button>
                        </div>
                        <p className="font-black text-sm">NPR {item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))
                )}
            </section>

            {/* Form Section */}
            {cart.items.length > 0 && (
              <form className="space-y-4 pb-10">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <User size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Required Details</span>
                </div>
                
                <div className="grid gap-3">
                  <input
                    type="text"
                    required
                    placeholder="CUSTOMER NAME *"
                    value={checkoutForm.customerName}
                    onChange={(e) => setCheckoutForm(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-white/40 outline-none"
                  />
                  
                  <input
                    type="email"
                    required
                    placeholder="EMAIL ADDRESS *"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-white/40 outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      required
                      placeholder="PHONE *"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm(p => ({ ...p, phone: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-white/40 outline-none"
                    />
                    <select
                      value={checkoutForm.orderType}
onChange={(e) => setCheckoutForm(p => ({ ...p, orderType: e.target.value as CheckoutFormState["orderType"] }))}
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-white/40 outline-none"
                    >
                      <option value="DINE_IN" className="bg-black text-white">DINE IN</option>
                      <option value="TAKEAWAY" className="bg-black text-white">TAKEAWAY</option>
                      <option value="DELIVERY" className="bg-black text-white">DELIVERY</option>
                    </select>
                  </div>

                  {checkoutForm.orderType === "DINE_IN" && (
                    <input
                      type="number"
                      placeholder="TABLE NUMBER *"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm"
                      onChange={(e) => setCheckoutForm(p => ({ ...p, tableNumber: e.target.value }))}
                    />
                  )}
                  
                  {checkoutForm.orderType === "DELIVERY" && (
                    <div className="relative">
                      <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type="text"
                        placeholder="DELIVERY ADDRESS *"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm"
                        onChange={(e) => setCheckoutForm(p => ({ ...p, deliveryAddress: e.target.value }))}
                      />
                    </div>
                  )}

                  <select
                    value={checkoutForm.paymentMethod}
onChange={(e) => setCheckoutForm(p => ({ ...p, paymentMethod: e.target.value as CheckoutFormState["paymentMethod"] }))}
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm"
                  >
                    <option value="cash" className="bg-black">CASH</option>
                    <option value="card" className="bg-black">CARD</option>
                    <option value="online" className="bg-black">ONLINE</option>
                  </select>
                </div>
              </form>
            )}
          </div>

          <footer className="p-6 bg-[#0a0a0a] border-t border-white/10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Grand Total</span>
              <span className="text-3xl font-black italic tracking-tighter">NPR {cart.totalPrice}</span>
            </div>

            {checkoutError && <p className="text-red-500 text-[10px] font-bold uppercase mb-4 text-center">{checkoutError}</p>}
            {checkoutSuccess && <p className="text-green-500 text-[10px] font-bold uppercase mb-4 text-center">{checkoutSuccess}</p>}

            <button
              onClick={handleCheckoutSubmit}
              disabled={cart.items.length === 0 || orderMutation.isPending}
              className="w-full group relative overflow-hidden bg-white text-black py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-transform active:scale-95 disabled:opacity-20"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {orderMutation.isPending ? "Processing..." : "Confirm Selection"}
                <ShoppingBag size={14} />
              </div>
              <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}