export interface CountryData {
  code: string;
  name: string;
  flag: string;
  taxedPrice: number;
  taxFreePrice: number;
  minimumWage: number;
  currency: string;
  equivalentValue: string;
}

export interface CarData {
  name: string;
  basePrice: number; // in USD
  countries: CountryData[];
}

export const mockCarData: Record<string, CarData> = {
  "BMW 320i": {
    name: "BMW 320i",
    basePrice: 45000,
    countries: [
      {
        code: "US",
        name: "United States",
        flag: "🇺🇸",
        taxedPrice: 45000,
        taxFreePrice: 42000,
        minimumWage: 1256,
        currency: "USD",
        equivalentValue: "Down payment on a house"
      },
      {
        code: "DE",
        name: "Germany",
        flag: "🇩🇪",
        taxedPrice: 48500,
        taxFreePrice: 40750,
        minimumWage: 1764,
        currency: "EUR",
        equivalentValue: "Small apartment in suburbs"
      },
      {
        code: "GB",
        name: "United Kingdom",
        flag: "🇬🇧",
        taxedPrice: 51200,
        taxFreePrice: 42600,
        minimumWage: 1823,
        currency: "GBP",
        equivalentValue: "Year tuition at university"
      },
      {
        code: "FR",
        name: "France",
        flag: "🇫🇷",
        taxedPrice: 49800,
        taxFreePrice: 41500,
        minimumWage: 1747,
        currency: "EUR",
        equivalentValue: "Studio apartment (1 year rent)"
      },
      {
        code: "JP",
        name: "Japan",
        flag: "🇯🇵",
        taxedPrice: 52000,
        taxFreePrice: 46800,
        minimumWage: 1100,
        currency: "JPY",
        equivalentValue: "High-end electronics collection"
      },
      {
        code: "CN",
        name: "China",
        flag: "🇨🇳",
        taxedPrice: 58000,
        taxFreePrice: 45000,
        minimumWage: 2480,
        currency: "CNY",
        equivalentValue: "Small shop in tier-2 city"
      },
      {
        code: "BR",
        name: "Brazil",
        flag: "🇧🇷",
        taxedPrice: 78000,
        taxFreePrice: 45000,
        minimumWage: 1212,
        currency: "BRL",
        equivalentValue: "Mid-range apartment"
      },
      {
        code: "IN",
        name: "India",
        flag: "🇮🇳",
        taxedPrice: 52000,
        taxFreePrice: 45000,
        minimumWage: 162,
        currency: "INR",
        equivalentValue: "Luxury apartment in metro"
      },
      {
        code: "RU",
        name: "Russia",
        flag: "🇷🇺",
        taxedPrice: 51000,
        taxFreePrice: 42500,
        minimumWage: 13617,
        currency: "RUB",
        equivalentValue: "Small dacha outside city"
      },
      {
        code: "CA",
        name: "Canada",
        flag: "🇨🇦",
        taxedPrice: 47500,
        taxFreePrice: 41000,
        minimumWage: 1942,
        currency: "CAD",
        equivalentValue: "Used car + savings"
      },
      {
        code: "AU",
        name: "Australia",
        flag: "🇦🇺",
        taxedPrice: 53000,
        taxFreePrice: 44100,
        minimumWage: 2562,
        currency: "AUD",
        equivalentValue: "6 months rent (Sydney)"
      },
      {
        code: "MX",
        name: "Mexico",
        flag: "🇲🇽",
        taxedPrice: 62000,
        taxFreePrice: 48000,
        minimumWage: 248,
        currency: "MXN",
        equivalentValue: "Small house in suburb"
      },
      {
        code: "KR",
        name: "South Korea",
        flag: "🇰🇷",
        taxedPrice: 54000,
        taxFreePrice: 45000,
        minimumWage: 1914,
        currency: "KRW",
        equivalentValue: "Premium smartphone × 30"
      },
      {
        code: "IT",
        name: "Italy",
        flag: "🇮🇹",
        taxedPrice: 50500,
        taxFreePrice: 42000,
        minimumWage: 1400,
        currency: "EUR",
        equivalentValue: "Apartment rent (18 months)"
      },
      {
        code: "ES",
        name: "Spain",
        flag: "🇪🇸",
        taxedPrice: 48000,
        taxFreePrice: 40000,
        minimumWage: 1260,
        currency: "EUR",
        equivalentValue: "Apartment rent (2 years)"
      },
      {
        code: "NL",
        name: "Netherlands",
        flag: "🇳🇱",
        taxedPrice: 52000,
        taxFreePrice: 43000,
        minimumWage: 1995,
        currency: "EUR",
        equivalentValue: "High-end bicycle × 50"
      },
      {
        code: "SE",
        name: "Sweden",
        flag: "🇸🇪",
        taxedPrice: 54000,
        taxFreePrice: 43200,
        minimumWage: 20500,
        currency: "SEK",
        equivalentValue: "Summer cottage renovation"
      },
      {
        code: "CH",
        name: "Switzerland",
        flag: "🇨🇭",
        taxedPrice: 56000,
        taxFreePrice: 47000,
        minimumWage: 4056,
        currency: "CHF",
        equivalentValue: "10 months groceries"
      },
      {
        code: "AE",
        name: "UAE",
        flag: "🇦🇪",
        taxedPrice: 47000,
        taxFreePrice: 45000,
        minimumWage: 1000,
        currency: "AED",
        equivalentValue: "Luxury watches × 3"
      },
      {
        code: "SG",
        name: "Singapore",
        flag: "🇸🇬",
        taxedPrice: 82000,
        taxFreePrice: 45000,
        minimumWage: 1400,
        currency: "SGD",
        equivalentValue: "Certificate of Entitlement only"
      },
      {
        code: "ZA",
        name: "South Africa",
        flag: "🇿🇦",
        taxedPrice: 54000,
        taxFreePrice: 42000,
        minimumWage: 3500,
        currency: "ZAR",
        equivalentValue: "Small house in township"
      },
      {
        code: "TR",
        name: "Turkey",
        flag: "🇹🇷",
        taxedPrice: 68000,
        taxFreePrice: 45000,
        minimumWage: 11402,
        currency: "TRY",
        equivalentValue: "Apartment in coastal town"
      },
      {
        code: "PL",
        name: "Poland",
        flag: "🇵🇱",
        taxedPrice: 46000,
        taxFreePrice: 38000,
        minimumWage: 3600,
        currency: "PLN",
        equivalentValue: "Small apartment (provincial)"
      },
      {
        code: "TH",
        name: "Thailand",
        flag: "🇹🇭",
        taxedPrice: 58000,
        taxFreePrice: 46000,
        minimumWage: 10700,
        currency: "THB",
        equivalentValue: "Condo in Bangkok suburbs"
      },
      {
        code: "AR",
        name: "Argentina",
        flag: "🇦🇷",
        taxedPrice: 72000,
        taxFreePrice: 45000,
        minimumWage: 118000,
        currency: "ARS",
        equivalentValue: "Small apartment downtown"
      },
      {
        code: "NO",
        name: "Norway",
        flag: "🇳🇴",
        taxedPrice: 58000,
        taxFreePrice: 43500,
        minimumWage: 23400,
        currency: "NOK",
        equivalentValue: "Cabin furniture (complete)"
      },
      {
        code: "DK",
        name: "Denmark",
        flag: "🇩🇰",
        taxedPrice: 62000,
        taxFreePrice: 44000,
        minimumWage: 18900,
        currency: "DKK",
        equivalentValue: "Premium bicycle × 40"
      },
      {
        code: "FI",
        name: "Finland",
        flag: "🇫🇮",
        taxedPrice: 53000,
        taxFreePrice: 42800,
        minimumWage: 1700,
        currency: "EUR",
        equivalentValue: "Sauna renovation (luxury)"
      },
      {
        code: "CL",
        name: "Chile",
        flag: "🇨🇱",
        taxedPrice: 56000,
        taxFreePrice: 44000,
        minimumWage: 380000,
        currency: "CLP",
        equivalentValue: "Apartment in Valparaíso"
      },
      {
        code: "MY",
        name: "Malaysia",
        flag: "🇲🇾",
        taxedPrice: 52000,
        taxFreePrice: 43000,
        minimumWage: 1500,
        currency: "MYR",
        equivalentValue: "Condo down payment (KL)"
      }
    ]
  },
  "Toyota Corolla": {
    name: "Toyota Corolla",
    basePrice: 22000,
    countries: [
      {
        code: "US",
        name: "United States",
        flag: "🇺🇸",
        taxedPrice: 22000,
        taxFreePrice: 20500,
        minimumWage: 1256,
        currency: "USD",
        equivalentValue: "Gaming setup + furniture"
      },
      {
        code: "DE",
        name: "Germany",
        flag: "🇩🇪",
        taxedPrice: 24000,
        taxFreePrice: 20000,
        minimumWage: 1764,
        currency: "EUR",
        equivalentValue: "Year of groceries (family)"
      },
      {
        code: "GB",
        name: "United Kingdom",
        flag: "🇬🇧",
        taxedPrice: 25000,
        taxFreePrice: 20800,
        minimumWage: 1823,
        currency: "GBP",
        equivalentValue: "Master's degree tuition"
      },
      {
        code: "JP",
        name: "Japan",
        flag: "🇯🇵",
        taxedPrice: 26500,
        taxFreePrice: 23800,
        minimumWage: 1100,
        currency: "JPY",
        equivalentValue: "Laptop × 15"
      },
      {
        code: "CN",
        name: "China",
        flag: "🇨🇳",
        taxedPrice: 28000,
        taxFreePrice: 22000,
        minimumWage: 2480,
        currency: "CNY",
        equivalentValue: "iPhone × 20"
      },
      {
        code: "BR",
        name: "Brazil",
        flag: "🇧🇷",
        taxedPrice: 38000,
        taxFreePrice: 22000,
        minimumWage: 1212,
        currency: "BRL",
        equivalentValue: "Small apartment (countryside)"
      },
      {
        code: "IN",
        name: "India",
        flag: "🇮🇳",
        taxedPrice: 26000,
        taxFreePrice: 22000,
        minimumWage: 162,
        currency: "INR",
        equivalentValue: "Mid-range apartment"
      },
      {
        code: "CA",
        name: "Canada",
        flag: "🇨🇦",
        taxedPrice: 23500,
        taxFreePrice: 20000,
        minimumWage: 1942,
        currency: "CAD",
        equivalentValue: "Winter gear collection"
      },
      {
        code: "AU",
        name: "Australia",
        flag: "🇦🇺",
        taxedPrice: 26000,
        taxFreePrice: 21600,
        minimumWage: 2562,
        currency: "AUD",
        equivalentValue: "3 months rent (Melbourne)"
      },
      {
        code: "MX",
        name: "Mexico",
        flag: "🇲🇽",
        taxedPrice: 30000,
        taxFreePrice: 23000,
        minimumWage: 248,
        currency: "MXN",
        equivalentValue: "Apartment (1 year rent)"
      }
    ]
  }
};

export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.5 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 4.97 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", rate: 0.88 },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", rate: 10.67 },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", rate: 10.87 },
  { code: "DKK", symbol: "kr", name: "Danish Krone", rate: 6.87 },
  { code: "PLN", symbol: "zł", name: "Polish Złoty", rate: 4.02 },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", rate: 28.77 },
  { code: "MXN", symbol: "$", name: "Mexican Peso", rate: 16.99 },
  { code: "KRW", symbol: "₩", name: "South Korean Won", rate: 1329 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.34 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.65 },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal", rate: 3.75 },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", rate: 1.62 },
  { code: "ARS", symbol: "$", name: "Argentine Peso", rate: 880 },
];
