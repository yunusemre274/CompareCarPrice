import { Car } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySelector } from "./CurrencySelector";

interface NavbarProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export function Navbar({ selectedCurrency, onCurrencyChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CarCompare</h1>
              <p className="text-xs text-muted-foreground">Global Price Comparison</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CurrencySelector value={selectedCurrency} onChange={onCurrencyChange} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
