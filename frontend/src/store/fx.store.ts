import { create } from "zustand";

export interface FxCountry {
  code: string;
  currency: string;
  symbol: string;
  fxFromInr: number;
  taxLabel: string;
  taxRate: number;
}

export interface FxConfig {
  defaultCountry: string;
  updatedAt: string;
  countries: FxCountry[];
}

interface FxState {
  config: FxConfig | null;
  country: string;
  setConfig: (config: FxConfig) => void;
  setCountry: (code: string) => void;
  meta: () => FxCountry | null;
  convert: (inrAmount: number) => { amount: number; currency: string; symbol: string };
}

export const useFxStore = create<FxState>((set, get) => ({
  config: null,
  country: "IN",

  setConfig: (config) => set({ config }),
  setCountry: (country) => set({ country }),

  meta: () => {
    const { config, country } = get();
    if (!config) return null;
    return (
      config.countries.find((c) => c.code === country) ??
      config.countries.find((c) => c.code === config.defaultCountry) ??
      null
    );
  },

  convert: (inrAmount) => {
    const m = get().meta();
    if (!m) return { amount: inrAmount, currency: "INR", symbol: "₹" };
    return {
      amount: Math.round(inrAmount * m.fxFromInr * 100) / 100,
      currency: m.currency,
      symbol: m.symbol,
    };
  },
}));
