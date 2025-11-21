import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { apiService } from "@/lib/apiService";
import { currencies as currencyMetadata } from "@/lib/mockData";

const FALLBACK_RATES: Record<string, number> = currencyMetadata.reduce((acc, currency) => {
  acc[currency.code] = currency.rate ?? 1;
  return acc;
}, {} as Record<string, number>);

interface CurrencyContextValue {
  selectedCurrency: string;
  setSelectedCurrency: (code: string) => void;
  rates: Record<string, number>;
  base: string;
  lastUpdated?: string;
  isLoading: boolean;
  error: string | null;
  convert: (amountInUsd: number, currency?: string) => number;
  format: (amountInUsd: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
  getSymbol: (currencyCode: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const getInitialCurrency = () => {
  if (typeof window === "undefined") return "USD";
  return localStorage.getItem("selectedCurrency") || "USD";
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>(getInitialCurrency);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [base, setBase] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getExchangeRates();
      if (response?.rates) {
        setRates(response.rates);
        setBase(response.base || "USD");
        setLastUpdated(response.last_updated || new Date().toISOString());
        setError(null);
      } else {
        throw new Error("Malformed exchange rate response");
      }
    } catch (err) {
      console.error("Failed to load exchange rates", err);
      setError(err instanceof Error ? err.message : "Failed to load exchange rates");
      // fallback rates stay in place
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 15 * 60 * 1000); // refresh every 15 minutes
    return () => clearInterval(interval);
  }, [fetchRates]);

  const setSelectedCurrency = useCallback((code: string) => {
    setSelectedCurrencyState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCurrency", code);
    }
  }, []);

  const getSymbol = useCallback((currencyCode: string) => {
    return (
      currencyMetadata.find((currency) => currency.code === currencyCode)?.symbol ||
      currencyCode
    );
  }, []);

  const convert = useCallback(
    (amountInUsd: number, currencyCode = selectedCurrency) => {
      if (!Number.isFinite(amountInUsd)) return 0;
      const target = currencyCode.toUpperCase();
      if (target === base) return amountInUsd;
      const rate = rates[target] || FALLBACK_RATES[target] || 1;
      return amountInUsd * rate;
    },
    [base, rates, selectedCurrency]
  );

  const format = useCallback(
    (amountInUsd: number, currencyCode = selectedCurrency, options?: Intl.NumberFormatOptions) => {
      const converted = convert(amountInUsd, currencyCode);
      const symbol = getSymbol(currencyCode);
      return `${symbol}${new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...options,
      }).format(converted)}`;
    },
    [convert, getSymbol, selectedCurrency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      selectedCurrency,
      setSelectedCurrency,
      rates,
      base,
      lastUpdated,
      isLoading,
      error,
      convert,
      format,
      getSymbol,
    }),
    [selectedCurrency, setSelectedCurrency, rates, base, lastUpdated, isLoading, error, convert, format, getSymbol]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
