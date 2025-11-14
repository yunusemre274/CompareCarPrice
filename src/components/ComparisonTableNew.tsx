import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { CountryComparisonData } from "@/lib/apiService";
import { Button } from "@/components/ui/button";
import { CountryPanel } from "@/components/CountryPanel";
import { cn } from "@/lib/utils";

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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <div className="text-sm text-muted-foreground text-right">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}

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
                  Country
                  <SortIcon field="name" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("taxedPrice")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  Taxed Price
                  <SortIcon field="taxedPrice" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("taxFreePrice")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  Tax-Free Price
                  <SortIcon field="taxFreePrice" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("minimumWage")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  Min. Wage/Month
                  <SortIcon field="minimumWage" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("days")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  Days to Buy
                  <SortIcon field="days" />
                </Button>
              </th>
              <th className="text-right p-4 font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("purchasingPower")}
                  className="h-auto p-0 hover:bg-transparent font-semibold ml-auto flex items-center"
                >
                  Power Score
                  <SortIcon field="purchasingPower" />
                </Button>
              </th>
              <th className="text-left p-4 font-semibold min-w-[200px]">
                Equivalent Value
              </th>
              <th className="text-center p-4 font-semibold">
                Currency
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((country, index) => (
              <>
                <tr
                  key={country.country_code}
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
                    <div className="font-mono font-semibold">{country.taxed_price.formatted_usd}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {country.taxed_price.formatted_value_local}
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <div className="font-mono text-muted-foreground">{country.tax_free_price.formatted_usd}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      -{country.tax_rate_percentage.toFixed(1)}% tax
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <div className="font-mono text-sm">{country.minimum_wage.monthly.formatted_usd}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {country.minimum_wage.hourly.formatted_usd}/hr
                    </div>
                  </td>
                  <td className="p-4 text-right border-b border-border">
                    <span className={cn(
                      "inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold text-sm",
                      country.days_required < 100 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      country.days_required < 300 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {country.days_required.toFixed(0)} days
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
                      <CountryPanel
                        countryCode={country.country_code}
                        countryName={country.country_name}
                        flag={country.flag_emoji}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        <StatCard
          label="Countries Compared"
          value={data.length.toString()}
          icon="🌍"
        />
        <StatCard
          label="Best Affordability"
          value={`${sortedData[0]?.country_name || 'N/A'}`}
          sublabel={`${sortedData[0]?.days_required.toFixed(0) || '0'} days`}
          icon="⭐"
        />
        <StatCard
          label="Lowest Price"
          value={sortedData.reduce((min, c) => 
            c.taxed_price.usd_value < min ? c.taxed_price.usd_value : min, Infinity) !== Infinity
            ? `$${sortedData.reduce((min, c) => c.taxed_price.usd_value < min ? c.taxed_price.usd_value : min, Infinity).toLocaleString()}`
            : 'N/A'
          }
          icon="💵"
        />
        <StatCard
          label="Highest Wage"
          value={sortedData.reduce((max, c) => 
            c.minimum_wage.monthly.usd_value > max ? c.minimum_wage.monthly.usd_value : max, 0) > 0
            ? `$${sortedData.reduce((max, c) => c.minimum_wage.monthly.usd_value > max ? c.minimum_wage.monthly.usd_value : max, 0).toLocaleString()}`
            : 'N/A'
          }
          icon="💼"
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-12 bg-card rounded-lg border border-border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading comparison data...</span>
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
