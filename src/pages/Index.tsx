import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Footer } from "@/components/Footer";
import { mockCarData } from "@/lib/mockData";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchQuery(query);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const currentCarData = mockCarData[searchQuery] || null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      <Navbar
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Compare Car Prices Worldwide
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how car prices vary across countries and what it takes to buy your dream car anywhere in the world.
          </p>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {currentCarData ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">{currentCarData.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      Showing prices in {selectedCurrency} across {currentCarData.countries.length} countries
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Base Price (USD)</p>
                    <p className="text-2xl font-bold text-primary">
                      ${currentCarData.basePrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <ComparisonTable
                  data={currentCarData.countries}
                  selectedCurrency={selectedCurrency}
                  isLoading={isLoading}
                />

                <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">About this data:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Prices include local taxes and import duties where applicable</li>
                        <li>Minimum wage data reflects monthly net income</li>
                        <li>Days to buy calculation assumes 20 working days per month</li>
                        <li>Equivalent values are approximate comparisons for context</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg shadow-card">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Car not found</h3>
                <p className="text-muted-foreground mb-6">
                  We don't have data for "{searchQuery}" yet. Try searching for:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {Object.keys(mockCarData).map((carName) => (
                    <button
                      key={carName}
                      onClick={() => handleSearch(carName)}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors"
                    >
                      {carName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Compare prices across 30+ countries with real-time currency conversion
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Purchasing Power</h3>
              <p className="text-sm text-muted-foreground">
                See how many days of work it takes to buy a car in different countries
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Context Matters</h3>
              <p className="text-sm text-muted-foreground">
                Understand what car prices mean in local purchasing power terms
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
