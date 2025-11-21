import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { currencies } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between transition-all duration-300"
        >
          {selectedCurrency ? (
            <span>
              {selectedCurrency.symbol} {selectedCurrency.code}
            </span>
          ) : (
            t("currencySelector.placeholder")
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-popover border-border z-50">
        <Command>
          <CommandInput placeholder={t("currencySelector.search")} />
          <CommandEmpty>{t("currencySelector.empty")}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {currencies.map((currency) => (
              <CommandItem
                key={currency.code}
                value={currency.code}
                onSelect={(currentValue) => {
                  onChange(currentValue.toUpperCase());
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === currency.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1">{currency.name}</span>
                <span className="text-muted-foreground">
                  {currency.symbol}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
