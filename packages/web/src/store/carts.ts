import { create } from "zustand";
import { Cart } from "@/types/entity";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  carts: Cart[];
  add: (item: Cart) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCartsStore = create<Store>()(
  persist(
    (set, get) => ({
      carts: [],

      add: (item) => set((state) => ({ carts: [...state.carts, item] })),

      remove: (id) =>
        set((state) => ({
          carts: state.carts.filter((cart) => cart.id !== id),
        })),

      clear: () =>
        set((state) => ({
          carts: [],
        })),
    }),
    {
      name: "carts-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
