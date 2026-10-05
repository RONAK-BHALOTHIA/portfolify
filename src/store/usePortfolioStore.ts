import { create } from "zustand";
import { PortfolioData } from "@/types/portfolio";
import { defaultData } from "@/lib/defaultData";

type PortfolioState = {
  data: PortfolioData;
  templateId: string | null;
  setTemplate: (id: string) => void;
  updateField: <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => void;
  reset: () => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  data: defaultData,
  templateId: null,
  setTemplate: (id) => set({ templateId: id }),
  updateField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),
  reset: () => set({ data: defaultData, templateId: null }),
}));