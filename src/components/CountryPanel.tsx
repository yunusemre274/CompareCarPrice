import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Users, Building2, DollarSign, Globe, Calendar, Loader2 } from "lucide-react";
import { CountryDetails } from "@/lib/apiService";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CountryPanelProps {
  countryCode: string;
  countryName: string;
  flag: string;
  onClose?: () => void;
}

export function CountryPanel({ countryCode, countryName, flag }: CountryPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [countryData, setCountryData] = useState<CountryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get API URL from environment variable (same as apiService.ts)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  
  // Log API URL for verification
  console.log('CountryPanel API URL:', API_BASE_URL);

  // Fetch country data when panel opens
  useState(() => {
    const fetchCountryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/country/${countryCode}`);
        if (!response.ok) throw new Error('Failed to fetch country data');
        const data = await response.json();
        setCountryData(data);
      } catch (err) {
        setError('Unable to load country details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchCountryData();
    }
  });

  const formatNumber = (num: number | null | undefined, decimals = 0) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
  };

  const formatCurrency = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1000000000000) return `$${(num / 1000000000000).toFixed(2)}T`;
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="border-t-2 border-primary/20 bg-gradient-to-b from-accent/30 to-transparent animate-in slide-in-from-top-4 duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{flag}</span>
          <div className="text-left">
            <h3 className="text-lg font-semibold">{countryName}</h3>
            <p className="text-sm text-muted-foreground">Click to view detailed information</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading country details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              {error}
            </div>
          ) : countryData ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Economy Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <TrendingUp className="h-5 w-5" />
                  <h4 className="font-semibold text-lg">Economy</h4>
                </div>
                
                <div className="space-y-3 pl-7">
                  <DataRow 
                    label="GDP" 
                    value={formatCurrency(countryData.economy.gdp)}
                    sublabel="Total" 
                  />
                  <DataRow 
                    label="GDP per Capita" 
                    value={formatCurrency(countryData.economy.gdp_per_capita)}
                  />
                  <DataRow 
                    label="GDP Growth" 
                    value={`${countryData.economy.gdp_growth_rate?.toFixed(1)}%`}
                    trend={countryData.economy.gdp_growth_rate > 0 ? 'up' : 'down'}
                  />
                  <DataRow 
                    label="Inflation Rate" 
                    value={`${countryData.economy.inflation_rate?.yearly?.toFixed(1)}% yearly`}
                    sublabel={`${countryData.economy.inflation_rate?.monthly?.toFixed(2)}% monthly`}
                    trend={countryData.economy.inflation_rate?.yearly > 3 ? 'down' : 'neutral'}
                  />
                  <DataRow 
                    label="Interest Rate" 
                    value={`${countryData.economy.interest_rate?.toFixed(2)}%`}
                  />
                  <DataRow 
                    label="Unemployment" 
                    value={`${countryData.economy.unemployment_rate?.toFixed(1)}%`}
                    trend={countryData.economy.unemployment_rate < 5 ? 'up' : 'neutral'}
                  />
                  <DataRow 
                    label="Purchasing Power Index" 
                    value={formatNumber(countryData.economy.purchasing_power_index)}
                  />
                  <DataRow 
                    label="Welfare Score" 
                    value={`${countryData.economy.welfare_score?.toFixed(1)}/10`}
                  />
                </div>
              </div>

              {/* Government Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Building2 className="h-5 w-5" />
                  <h4 className="font-semibold text-lg">Government</h4>
                </div>
                
                <div className="space-y-3 pl-7">
                  <DataRow 
                    label="Head of State" 
                    value={countryData.government.president}
                  />
                  <DataRow 
                    label="Finance Minister" 
                    value={countryData.government.finance_minister}
                  />
                  <DataRow 
                    label="Government Type" 
                    value={countryData.government.government_type}
                  />
                </div>

                {/* Social Section */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Users className="h-5 w-5" />
                    <h4 className="font-semibold text-lg">Social</h4>
                  </div>
                  
                  <div className="space-y-3 pl-7">
                    <DataRow 
                      label="Population" 
                      value={formatNumber(countryData.social.population)}
                    />
                    <DataRow 
                      label="Birth Rate" 
                      value={`${countryData.social.birth_rate?.toFixed(1)} per 1,000`}
                    />
                    <DataRow 
                      label="Migration Rate" 
                      value={`${countryData.social.migration_rate?.toFixed(1)} per 1,000`}
                      trend={countryData.social.migration_rate > 0 ? 'up' : 'down'}
                    />
                    <DataRow 
                      label="Median Age" 
                      value={`${countryData.social.median_age?.toFixed(1)} years`}
                    />
                    <DataRow 
                      label="Education Index" 
                      value={countryData.social.education_index?.toFixed(2)}
                    />
                    {countryData.social.life_expectancy && (
                      <DataRow 
                        label="Life Expectancy" 
                        value={`${countryData.social.life_expectancy.toFixed(1)} years`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Minimum Wage Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <DollarSign className="h-5 w-5" />
                  <h4 className="font-semibold text-lg">Minimum Wage</h4>
                </div>
                
                <div className="space-y-3 pl-7">
                  <DataRow 
                    label="Monthly" 
                    value={countryData.minimum_wage.monthly.formatted_usd}
                  />
                  <DataRow 
                    label="Yearly" 
                    value={countryData.minimum_wage.yearly.formatted_usd}
                  />
                  <DataRow 
                    label="Weekly" 
                    value={countryData.minimum_wage.weekly.formatted_usd}
                  />
                  <DataRow 
                    label="Hourly" 
                    value={countryData.minimum_wage.hourly.formatted_usd}
                  />
                </div>
              </div>

              {/* Currency Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Globe className="h-5 w-5" />
                  <h4 className="font-semibold text-lg">Currency</h4>
                </div>
                
                <div className="space-y-3 pl-7">
                  <DataRow 
                    label="Currency" 
                    value={`${countryData.currency.name} (${countryData.currency.code})`}
                  />
                  <DataRow 
                    label="Symbol" 
                    value={countryData.currency.symbol}
                  />
                  <DataRow 
                    label="USD Exchange Rate" 
                    value={`1 USD = ${countryData.currency.usd_exchange_rate.toFixed(4)} ${countryData.currency.code}`}
                  />
                  <DataRow 
                    label="24h Change" 
                    value={`${countryData.currency.change_24h_percentage.toFixed(2)}%`}
                    trend={countryData.currency.change_24h_percentage >= 0 ? 'up' : 'down'}
                  />
                </div>

                {/* Currency Trend Chart */}
                {countryData.currency.trend_30_days && countryData.currency.trend_30_days.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">30-Day Trend</p>
                    <div className="h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={countryData.currency.trend_30_days}>
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="rate" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Last Updated */}
          {countryData && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
              <Calendar className="h-3 w-3" />
              <span>Last updated: {new Date(countryData.last_updated).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component for data rows
function DataRow({ label, value, sublabel, trend }: { 
  label: string; 
  value: string; 
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="flex items-start justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{value}</span>
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
        </div>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
