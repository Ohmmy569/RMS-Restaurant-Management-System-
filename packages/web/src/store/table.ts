import { create } from "zustand";
import { TableEntity } from "@/types/entity";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  table: Pick<TableEntity, "id" | "name">;
  setTable: (table: Pick<TableEntity, "id" | "name">) => void;
  clearTable: () => void;
};

export const useTableStore = create<Store>()(
  persist(
    (set, get) => ({
      table: {
        id: "",
        name: "",
      },

      setTable: (table) => {
        set({ table });
      },

      clearTable: () => {
        set({ table: { id: "", name: "" } });
      },
    }),
    {
      name: "table-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
