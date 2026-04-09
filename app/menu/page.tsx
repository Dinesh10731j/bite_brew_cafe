"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMenus } from "@/app/features/menu/api";
import { useAppDispatch } from "@/app/store/hooks";
import { addItem } from "@/app/store/slices/cartSlice";

export default function MenuPage() {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategoryId, availableOnly]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["menus", page, limit, search, selectedCategoryId, availableOnly],
    queryFn: () =>
      fetchMenus({
        page,
        limit,
        search: search.trim() || undefined,
        categoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId,
        available: availableOnly ? true : undefined,
      }),
  });

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, string>();
    (data?.data ?? []).forEach((item) => {
      if (item.category?.id && item.category?.name) {
        categoryMap.set(item.category.id, item.category.name);
      }
    });
    return [{ id: "all", name: "All" }, ...Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }))];
  }, [data]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let current = start; current <= end; current += 1) {
      pages.push(current);
    }
    return pages;
  }, [page, totalPages]);

  const handleAddToCart = (menuItem: {
    id: string;
    name: string;
    price: string;
    image: string | null;
  }) => {
    dispatch(
      addItem({
        menuItemId: menuItem.id,
        quantity: 1,
        name: menuItem.name,
        price: Number(menuItem.price),
        image: menuItem.image,
      })
    );
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#f5f0e6]">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1a5a46]">Menu</h1>
            <p className="text-black/65 mt-2">Browse menu items and add items to your cart.</p>
          </div>
          {isFetching && <p className="text-sm text-black/50">Refreshing menus...</p>}
        </div>

        <div className="mb-6 grid md:grid-cols-3 gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search menu items"
            className="rounded-xl border border-black/15 px-3 py-2 bg-white"
          />
          <select
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="rounded-xl border border-black/15 px-3 py-2 bg-white"
          >
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="rounded-xl border border-black/15 px-3 py-2 bg-white flex items-center gap-2 text-sm font-medium text-black/70">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
            />
            Available only
          </label>
        </div>

        {isLoading && <p className="text-lg font-semibold text-black/70">Loading menus...</p>}
        {isError && (
          <p className="text-red-600 font-medium">
            {(error as Error).message || "Failed to load menus."}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {data?.data?.map((menuItem) => (
                <article
                  key={menuItem.id}
                  className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm flex flex-col"
                >
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#efe6d9] mb-4">
                    {menuItem.image ? (
                      <Image
                        src={menuItem.image}
                        alt={menuItem.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={menuItem.image.includes("res.cloudinary.com")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/40 text-sm font-semibold">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <h2 className="text-xl font-black text-[#1a5a46]">{menuItem.name}</h2>
                    <p className="text-xs text-black/45 uppercase tracking-wide">
                      {menuItem.category?.name ?? "Uncategorized"}
                    </p>
                    <p className="text-sm text-black/60 min-h-10">{menuItem.description}</p>
                    <p className="text-lg font-bold text-black">NPR {Number(menuItem.price).toFixed(2)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(menuItem)}
                    className="mt-4 w-full rounded-xl bg-[#1a5a46] text-white py-2.5 font-semibold hover:bg-[#207659] transition-colors"
                  >
                    Add to cart
                  </button>
                </article>
              ))}
            </div>

            {data?.data?.length === 0 && (
              <p className="mt-8 text-black/60">No menu items found for current filters.</p>
            )}

            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="h-10 w-10 rounded-xl border border-black/15 bg-white flex items-center justify-center disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {visiblePages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-10 min-w-10 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                    pageNumber === page
                      ? "bg-[#1a5a46] text-white border-[#1a5a46]"
                      : "bg-white text-black border-black/15 hover:border-[#1a5a46]/40"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="h-10 w-10 rounded-xl border border-black/15 bg-white flex items-center justify-center disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
