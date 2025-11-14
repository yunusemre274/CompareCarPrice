import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { CountryData } from "@/lib/mockData";
import { currencies } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  data: CountryData[];
  selectedCurrency: string;
  isLoading?: boolean;
}

type SortField = "name" | "taxedPrice" | "taxFreePrice" | "minimumWage" | "days";
type SortDirection = "asc" | "desc" | null;

export function ComparisonTable({ data, selectedCurrency, isLoading }: ComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const currencyRate = currencies.find((c) => c.code === selectedCurrency)?.rate || 1;
  const currencySymbol = currencies.find((c) => c.code === selectedCurrency)?.symbol || "$";

  const convertPrice = (price: number, fromCurrency: string) => {
    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const usdPrice = price / fromRate;
    return usdPrice * currencyRate;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return data;

    return [...data].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "taxedPrice":
          aValue = convertPrice(a.taxedPrice, a.currency);
          bValue = convertPrice(b.taxedPrice, b.currency);
          break;
        case "taxFreePrice":
          aValue = convertPrice(a.taxFreePrice, a.currency);
          bValue = convertPrice(b.taxFreePrice, b.currency);
          break;
        case "minimumWage":
          aValue = convertPrice(a.minimumWage, a.currency);
          bValue = convertPrice(b.minimumWage, b.currency);
          break;
        case "days":
          aValue = Math.ceil(convertPrice(a.taxedPrice, a.currency) / convertPrice(a.minimumWage, a.currency) / 20);
          bValue = Math.ceil(convertPrice(b.taxedPrice, b.currency) / convertPrice(b.minimumWage, b.currency) / 20);
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, sortField, sortDirection, selectedCurrency]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const formatPrice = (price: number, fromCurrency: string) => {
    const converted = convertPrice(price, fromCurrency);
    return `${currencySymbol}${converted.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const calculateDays = (price: number, wage: number, currency: string) => {
    const convertedPrice = convertPrice(price, currency);
    const convertedWage = convertPrice(wage, currency);
    const daysNeeded = Math.ceil(convertedPrice / convertedWage / 20); // Assuming 20 working days per month
    return daysNeeded;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-table-border shadow-card">
      <table className="w-full border-collapse">
        <thead className="bg-table-header sticky top-0 z-10">
          <tr>
            <th className="text-left p-4 font-semibold border-b border-table-border">
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="h-auto p-0 hover:bg-transparent font-semibold"
              >
                Country
                <SortIcon field="name" />
              </Button>
            </th>
            <th className="text-right p-4 font-semibold border-b border-table-border">
              <Button
                variant="ghost"
                onClick={() => handleSort("taxedPrice")}
                className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
              >
                Taxed Price
                <SortIcon field="taxedPrice" />
              </Button>
            </th>
            <th className="text-right p-4 font-semibold border-b border-table-border">
              <Button
                variant="ghost"
                onClick={() => handleSort("taxFreePrice")}
                className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
              >
                Tax-Free Price
                <SortIcon field="taxFreePrice" />
              </Button>
            </th>
            <th className="text-right p-4 font-semibold border-b border-table-border">
              <Button
                variant="ghost"
                onClick={() => handleSort("minimumWage")}
                className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
              >
                Min. Wage/Month
                <SortIcon field="minimumWage" />
              </Button>
            </th>
            <th className="text-right p-4 font-semibold border-b border-table-border">
              <Button
                variant="ghost"
                onClick={() => handleSort("days")}
                className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
              >
                Days to Buy
                <SortIcon field="days" />
              </Button>
            </th>
            <th className="text-left p-4 font-semibold border-b border-table-border min-w-[200px]">
              Equivalent Value
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((country, index) => (
            <tr
              key={country.code}
              className={cn(
                "transition-colors hover:bg-muted/50",
                index % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd"
              )}
            >
              <td className="p-4 border-b border-table-border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </div>
              </td>
              <td className="p-4 text-right border-b border-table-border font-mono">
                {formatPrice(country.taxedPrice, country.currency)}
              </td>
              <td className="p-4 text-right border-b border-table-border font-mono text-muted-foreground">
                {formatPrice(country.taxFreePrice, country.currency)}
              </td>
              <td className="p-4 text-right border-b border-table-border font-mono text-sm">
                {formatPrice(country.minimumWage, country.currency)}
              </td>
              <td className="p-4 text-right border-b border-table-border">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  {calculateDays(country.taxedPrice, country.minimumWage, country.currency)} days
                </span>
              </td>
              <td className="p-4 border-b border-table-border text-sm text-muted-foreground">
                {country.equivalentValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-table-border shadow-card">
      <div className="bg-table-header p-4 border-b border-table-border">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "p-4 border-b border-table-border",
              i % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd"
            )}
          >
            <div className="grid grid-cols-6 gap-4">
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
