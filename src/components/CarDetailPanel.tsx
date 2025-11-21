import { useMemo } from "react";
import { CarComparisonResponse, CountryComparisonData } from "@/lib/apiService";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { Gauge, Globe2, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

interface CarDetailPanelProps {
  car: CarComparisonResponse["car"];
  countries: CountryComparisonData[];
  selectedCurrency: string;
}

export function CarDetailPanel({ car, countries, selectedCurrency }: CarDetailPanelProps) {
  const { format } = useCurrency();
  const { t } = useTranslation();

  const insights = useMemo(() => {
    if (!countries.length) {
      return null;
    }

    const byPrice = [...countries].sort(
      (a, b) => a.taxed_price.usd_value - b.taxed_price.usd_value
    );
    const byDays = [...countries].sort((a, b) => a.days_required - b.days_required);

    const cheapest = byPrice[0];
    const expensive = byPrice[byPrice.length - 1];
    const bestAffordability = byDays[0];
    const averagePriceUsd =
      byPrice.reduce((sum, country) => sum + country.taxed_price.usd_value, 0) / byPrice.length;
    const priceSpreadUsd = Math.max(
      0,
      expensive.taxed_price.usd_value - cheapest.taxed_price.usd_value
    );
    const medianDays =
      byDays[Math.floor(byDays.length / 2)]?.days_required ?? bestAffordability.days_required;
    const topMarkets = byDays.slice(0, Math.min(3, byDays.length));
    const watchMarkets = byPrice.slice(-Math.min(3, byPrice.length)).reverse();

    return {
      cheapest,
      expensive,
      bestAffordability,
      averagePriceUsd,
      priceSpreadUsd,
      medianDays,
      topMarkets,
      watchMarkets,
    };
  }, [countries]);

  if (!insights) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {t("carPanel.noData")}
      </div>
    );
  }

  const heroSubtitle = t("carPanel.subtitle", {
    brand: car.brand,
    category: car.category,
    year: car.year,
  });

  const basePriceUsd = car.base_price_usd
    ? `$${car.base_price_usd.toLocaleString()}`
    : t("common.notAvailable");
  const cheapestPrice = format(insights.cheapest.taxed_price.usd_value, selectedCurrency);
  const expensivePrice = format(insights.expensive.taxed_price.usd_value, selectedCurrency);
  const averagePrice = format(insights.averagePriceUsd, selectedCurrency);
  const spreadPrice = format(insights.priceSpreadUsd, selectedCurrency);
  const score = Math.round(
    Math.max(
      20,
      Math.min(
        95,
        (insights.medianDays / Math.max(insights.bestAffordability.days_required, 1)) * 25 + 35
      )
    )
  );

  const priceRangeLabel = t("carPanel.priceRange", {
    min: cheapestPrice,
    max: expensivePrice,
  });

  const highlightMessages = [
    t("carPanel.highlightCheapest", {
      country: insights.cheapest.country_name,
      price: cheapestPrice,
    }),
    t("carPanel.highlightExpensive", {
      country: insights.expensive.country_name,
      price: expensivePrice,
    }),
    t("carPanel.highlightSpread", { spread: spreadPrice }),
    t("carPanel.highlightAverage", { price: averagePrice }),
  ];

  const statCards = [
    {
      label: t("carPanel.cheapestMarket"),
      value: cheapestPrice,
      sublabel: insights.cheapest.country_name,
      icon: TrendingDown,
    },
    {
      label: t("carPanel.expensiveMarket"),
      value: expensivePrice,
      sublabel: insights.expensive.country_name,
      icon: TrendingUp,
    },
    {
      label: t("carPanel.bestAffordability"),
      value: t("carPanel.daysLabel", {
        value: insights.bestAffordability.days_required.toFixed(0),
      }),
      sublabel: insights.bestAffordability.country_name,
      icon: Gauge,
    },
    {
      label: t("carPanel.priceSpread"),
      value: spreadPrice,
      sublabel: priceRangeLabel,
      icon: Globe2,
    },
  ];

  const fallbackImage =
    car.image ||
    `https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80&car=${encodeURIComponent(
      car.model
    )}`;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {t("carPanel.title")}
          </p>
          <h2 className="text-3xl font-bold text-foreground">{car.name}</h2>
          <p className="text-sm text-muted-foreground">{heroSubtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{t("carPanel.basePriceLabel")}</p>
          <p className="text-2xl font-bold text-primary">{basePriceUsd}</p>
          <p className="text-xs text-muted-foreground">{t("carPanel.basePriceInfo")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <img
            src={fallbackImage}
            alt={car.name}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("carPanel.currencyContext", { currency: selectedCurrency })}
                </p>
                <p className="text-3xl font-semibold text-foreground">{averagePrice}</p>
                <p className="text-xs text-muted-foreground">
                  {t("carPanel.averagePrice")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("carPanel.scoreLabel")}
                </p>
                <p className="text-4xl font-bold text-primary">{score}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {statCards.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">
              {t("carPanel.marketHighlights")}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {highlightMessages.map((message) => (
                <li key={message} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MarketList
          title={t("carPanel.topMarkets")}
          items={insights.topMarkets}
          formatter={(country) =>
            `${format(country.taxed_price.usd_value, selectedCurrency)} · ${t("carPanel.daysLabel", {
              value: country.days_required.toFixed(0),
            })}`
          }
        />
        <MarketList
          title={t("carPanel.watchMarkets")}
          items={insights.watchMarkets}
          formatter={(country) =>
            `${format(country.taxed_price.usd_value, selectedCurrency)} · ${t("carPanel.daysLabel", {
              value: country.days_required.toFixed(0),
            })}`
          }
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: typeof TrendingDown;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function MarketList({
  title,
  items,
  formatter,
}: {
  title: string;
  items: CountryComparisonData[];
  formatter: (country: CountryComparisonData) => string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((country) => (
          <li
            key={country.country_code}
            className="flex items-center justify-between gap-4 text-muted-foreground"
          >
            <span className="flex items-center gap-2 text-foreground">
              <span className="text-xl">{country.flag_emoji}</span>
              {country.country_name}
            </span>
            <span className="text-xs text-muted-foreground">{formatter(country)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CarDetailPanelSkeleton() {
  const cards = Array.from({ length: 4 });

  return (
    <section className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-3 w-24 rounded bg-muted" />
          <div className="ml-auto h-8 w-32 rounded bg-muted" />
          <div className="ml-auto h-3 w-20 rounded bg-muted" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-64 rounded-2xl border border-border bg-muted" />
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((_, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-4">
                <div className="space-y-3">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-5 w-20 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="space-y-2">
              {cards.slice(0, 3).map((_, index) => (
                <div key={index} className="h-3 w-full rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((column) => (
          <div key={column} className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="h-4 w-40 rounded bg-muted" />
            {cards.slice(0, 3).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="h-4 w-28 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
