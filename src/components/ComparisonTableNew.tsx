import { Fragment, Suspense, lazy, useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { CountryComparisonData } from "@/lib/apiService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";

const CountryPanel = lazy(() =>
  import("@/components/CountryPanel").then((module) => ({ default: module.CountryPanel }))
);

interface ComparisonTableProps {
  data: CountryComparisonData[];
  selectedCurrency: string;
  isLoading?: boolean;
  lastUpdated?: string;
}

type SortField = "name" | "taxedPrice" | "taxFreePrice" | "minimumWage" | "days" | "purchasingPower";
type SortDirection = "asc" | "desc" | null;

export function ComparisonTable({ data, selectedCurrency, isLoading, lastUpdated }: ComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField | null>("days");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { format, getSymbol, lastUpdated: fxUpdated, isLoading: fxLoading } = useCurrency();
  const displayCurrency = selectedCurrency;
  const { t } = useTranslation();

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
          aValue = a.country_name;
          bValue = b.country_name;
          break;
        case "taxedPrice":
          aValue = a.taxed_price.usd_value;
          bValue = b.taxed_price.usd_value;
          break;
        case "taxFreePrice":
          aValue = a.tax_free_price.usd_value;
          bValue = b.tax_free_price.usd_value;
          break;
        case "minimumWage":
          aValue = a.minimum_wage.monthly.usd_value;
          bValue = b.minimum_wage.monthly.usd_value;
          break;
        case "days":
          aValue = a.days_required;
          bValue = b.days_required;
          break;
        case "purchasingPower":
          aValue = a.purchasing_power_score;
          bValue = b.purchasing_power_score;
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
  }, [data, sortField, sortDirection]);

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

  if (isLoading || fxLoading) {
    return <LoadingSkeleton message={t("comparison.loading")} />;
  }

  return (
    <div className="space-y-4">
      {/* Last Updated Timestamp */}
      <div className="flex flex-col gap-1 text-sm text-muted-foreground text-right">
        {lastUpdated && (
          <span>{t("comparison.dataUpdated", { value: new Date(lastUpdated).toLocaleString() })}</span>
        )}
        {fxUpdated && (
          <span>
            {t("comparison.fxUpdated", {
              value: new Date(fxUpdated).toLocaleTimeString(),
              currency: displayCurrency,
              symbol: getSymbol(displayCurrency)
            })}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-border shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-muted sticky top-0 z-10 border-b-2 border-border">
            <tr>
              <th className="text-left p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 hover:bg-transparent font-semibold"
                >
                  {t("comparison.columns.country")}
                  <SortIcon field="name" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("taxedPrice")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  {t("comparison.columns.taxedPrice")}
                  <SortIcon field="taxedPrice" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("taxFreePrice")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  {t("comparison.columns.taxFreePrice")}
                  <SortIcon field="taxFreePrice" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("minimumWage")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  {t("comparison.columns.minimumWage")}
                  <SortIcon field="minimumWage" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("days")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  {t("comparison.columns.daysToBuy")}
                  <SortIcon field="days" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("purchasingPower")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  {t("comparison.columns.powerScore")}
                  <SortIcon field="purchasingPower" />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold min-w-[200px]">
                {t("comparison.columns.equivalentValue")}
              </th>
              <th className="text-center p-4 font-semibold">
                {t("comparison.columns.currency")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((country, index) => (
              <Fragment key={country.country_code}>
                <tr
                  onClick={() => setSelectedCountry(
                    selectedCountry === country.country_code ? null : country.country_code
                  )}
                  className={cn(
                    "transition-all duration-200 cursor-pointer hover:bg-accent/50",
                    index % 2 === 0 ? "bg-card" : "bg-muted/30",
                    selectedCountry === country.country_code && "bg-primary/10 border-l-4 border-primary"
                  )}
                >
                  <td className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag_emoji}</span>
                      <span className="font-medium">{country.country_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <div className="font-mono font-semibold">
                      {format(country.taxed_price.usd_value, displayCurrency)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {country.taxed_price.formatted_value_local}
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <div className="font-mono text-muted-foreground">
                      {format(country.tax_free_price.usd_value, displayCurrency)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      {t("comparison.taxSavings", { value: country.tax_rate_percentage.toFixed(1) })}
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <div className="font-mono text-sm">
                      {format(country.minimum_wage.monthly.usd_value, displayCurrency)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t("comparison.hourly", {
                        value: format(country.minimum_wage.hourly.usd_value, displayCurrency, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <span className={cn(
                      "inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold text-sm",
                      country.days_required < 100 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      country.days_required < 300 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {t("comparison.days", { value: country.days_required.toFixed(0) })}
                    </span>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-500"
                          style={{ width: `${Math.min(100, country.purchasing_power_score)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{country.purchasing_power_score.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">
                        💰 {country.equivalent_value.gold_equivalent.description}
                      </div>
                      <div className="text-muted-foreground">
                        🏠 {country.equivalent_value.real_estate_equivalent.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-semibold">{country.local_currency.code}</span>
                      <span className="text-xs text-muted-foreground">{country.local_currency.symbol}</span>
                    </div>
                  </td>
                </tr>
                
                {/* Country Panel */}
                {selectedCountry === country.country_code && (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center gap-3 py-6 text-sm text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span>{t("countryPanel.loading")}</span>
                          </div>
                        }
                      >
                        <CountryPanel
                          countryCode={country.country_code}
                          countryName={country.country_name}
                          flag={country.flag_emoji}
                        />
                      </Suspense>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        <StatCard
          label={t("comparison.summary.countriesCompared")}
          value={data.length.toString()}
          icon="🌍"
        />
        <StatCard
          label={t("comparison.summary.bestAffordability")}
          value={sortedData[0]?.country_name || t("common.notAvailable")}
          sublabel={sortedData[0]?.days_required
            ? t("comparison.days", { value: sortedData[0].days_required.toFixed(0) })
            : t("common.notAvailable")}
          icon="⭐"
        />
        <StatCard
          label={t("comparison.summary.lowestPrice")}
          value={(() => {
            const min = sortedData.reduce(
              (acc, c) => (c.taxed_price.usd_value < acc ? c.taxed_price.usd_value : acc),
              Infinity
            );
            return Number.isFinite(min) ? format(min, displayCurrency) : t("common.notAvailable");
          })()}
          icon="💵"
        />
        <StatCard
          label={t("comparison.summary.highestWage")}
          value={(() => {
            const max = sortedData.reduce(
              (acc, c) => (c.minimum_wage.monthly.usd_value > acc ? c.minimum_wage.monthly.usd_value : acc),
              0
            );
            return max > 0 ? format(max, displayCurrency) : t("common.notAvailable");
          })()}
          icon="💼"
        />
      </div>
    </div>
  );
}

function LoadingSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-12 bg-card rounded-lg border border-border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">{message}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sublabel, icon }: { 
  label: string; 
  value: string; 
  sublabel?: string;
  icon: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">{label}</div>
          <div className="text-xl font-bold">{value}</div>
          {sublabel && (
            <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>
          )}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
