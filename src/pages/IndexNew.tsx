import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ComparisonTable } from "@/components/ComparisonTableNew";
import { Footer } from "@/components/Footer";
import { apiService, CarComparisonResponse } from "@/lib/apiService";
import { getCarByName } from "@/lib/carDatabase";
import { AlertCircle, TrendingUp, DollarSign, Globe2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || 'USD';
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [carData, setCarData] = useState<CarComparisonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Persist currency selection
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchQuery(query);
    setError(null);

    try {
      // Check if car exists in our database
      const carInfo = getCarByName(query);
      if (!carInfo) {
        throw new Error(`Car "${query}" not found in database`);
      }

      // Fetch real-time data from API
      const data = await apiService.getCarComparison(query);
      setCarData(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch car comparison data');
      setCarData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe2 className="h-4 w-4" />
            <span>Compare 250+ Cars Across 30+ Countries</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Global Car Price Comparison
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover real-time car prices worldwide with economic insights, purchasing power analysis, and affordability metrics
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>Multi-currency Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-blue-500" />
              <span>30+ Countries</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  <div className="mt-2 text-sm">
                    Try searching for: Toyota Camry, BMW 3 Series, Tesla Model 3, Mercedes C-Class, or Honda Civic
                  </div>
                </AlertDescription>
              </Alert>
            ) : carData ? (
              <div className="space-y-6">
                {/* Car Header */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{carData.car.name}</h2>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{carData.car.brand}</span>
                          {' • '}
                          <span>{carData.car.model}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{carData.car.category}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{carData.car.year}</span>
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing prices in {selectedCurrency} across {carData.total_countries} countries
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Base Price (USD)</p>
                      <p className="text-3xl font-bold text-primary">
                        ${carData.car.base_price_usd.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <ComparisonTable
                  data={carData.countries}
                  selectedCurrency={selectedCurrency}
                  isLoading={isLoading}
                  lastUpdated={carData.last_updated}
                />

                {/* Info Card */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">About this data:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Prices include local taxes and import duties where applicable</li>
                        <li>Minimum wage data reflects monthly net income in USD</li>
                        <li>Days to buy calculation assumes monthly wage divided by 30 days</li>
                        <li>Purchasing power score: 0-100 scale (higher is better affordability)</li>
                        <li>Currency exchange rates updated every 15 minutes</li>
                        <li>Economic data sourced from World Bank, IMF, and REST Countries API</li>
                        <li>Click on any country row to see detailed economic information</li>
                      </ul>
                      <div className="pt-2 border-t border-border mt-3">
                        <p className="text-xs">
                          Data Source: {carData.source} • Last Updated: {new Date(carData.last_updated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <div className="text-center py-12 space-y-6">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-semibold">Ready to compare car prices?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter any car model in the search bar above to see real-time prices, affordability analysis, and economic insights across the globe
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {['Toyota Camry', 'BMW 3 Series', 'Tesla Model 3', 'Mercedes C-Class', 'Honda Civic', 'Ford F-150'].map((car) => (
                <button
                  key={car}
                  onClick={() => handleSearch(car)}
                  className="px-4 py-2 rounded-full bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
                >
                  {car}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
