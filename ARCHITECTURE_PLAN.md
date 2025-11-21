# CarComparison – Data & System Architecture Plan

## 1. Technology Choices
- **Backend Runtime:** Node.js 20+ with TypeScript (ts-node/tsx).
- **Framework:** Express with modular routers + services.
- **Database:** PostgreSQL via Prisma ORM (strong relational modeling for cars/countries/prices).
- **Cache / Queue:** Redis (BullMQ) for caching exchange rates and scheduling ingestion jobs.
- **Cron Runner:** node-cron (lightweight) for simple schedules; BullMQ repeatable jobs for scalable ingestion.
- **External APIs:**
  - CarQuery (catalog/specs, free)
  - MarketCheck (pricing, used/new listings)
  - CarsXE (images/VIN specs)
  - ExchangeRate / CurrencyLayer / Fixer (FX rates)
  - WorldBank, OECD, Numbeo, IMF (macro data)

## 2. Data Model (Prisma Sketch)
```prisma
model CarBrand {
  id          String   @id @default(cuid())
  name        String   @unique
  country     String?
  cars        Car[]
}

model Car {
  id            String      @id @default(cuid())
  brandId       String
  brand         CarBrand    @relation(fields: [brandId], references: [id])
  model         String
  generation    String?
  baseYear      Int
  trims         CarTrim[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model CarTrim {
  id            String   @id @default(cuid())
  carId         String
  car           Car      @relation(fields: [carId], references: [id])
  name          String
  year          Int
  enginePowerHp Int?
  torqueNm      Int?
  fuelType      String?
  transmission  String?
  fuelCityL100  Float?
  fuelHwyL100   Float?
  displacementL Float?
  drivetrain    String?
  imageUrl      String?
  specs         Json
  prices        CarPrice[]
}

model Country {
  code             String   @id
  name             String
  currencyCode     String
  taxRatePercent   Float?
  minimumWageUSD   Float?
  purchasingPower  Float?
  metrics          CountryMetric[]
  prices           CarPrice[]
}

model CountryMetric {
  id            String   @id @default(cuid())
  countryCode   String
  country       Country  @relation(fields: [countryCode], references: [code])
  source        String
  gdpUsd        Float?
  inflationPct  Float?
  interestRate  Float?
  unemployment  Float?
  costOfLiving  Float?
  updatedAt     DateTime  @default(now())
}

model CarPrice {
  id            String   @id @default(cuid())
  carTrimId     String
  carTrim       CarTrim   @relation(fields: [carTrimId], references: [id])
  countryCode   String
  country       Country   @relation(fields: [countryCode], references: [code])
  priceType     PriceType
  amountUsd     Decimal   @db.Numeric(18,2)
  source        String
  capturedAt    DateTime  @default(now())
}

enum PriceType {
  NEW
  USED
  TAXED
  UNTAXED
}

model ExchangeRate {
  id           String   @id @default(cuid())
  base         String
  target       String
  rate         Decimal @db.Numeric(18,6)
  provider     String
  capturedAt   DateTime @default(now())
  expiresAt    DateTime
}

model IngestionJob {
  id           String   @id @default(cuid())
  type         String
  status       JobStatus
  startedAt    DateTime  @default(now())
  finishedAt   DateTime?
  error        String?
  metadata     Json?
}

enum JobStatus {
  PENDING
  RUNNING
  SUCCESS
  FAILED
}
```

## 3. Service Layers
1. **Car Catalog Service**
   - Pulls from CarQuery for base specs per brand/model/year.
   - Uses CarsXE for VIN images/spec enrichment.
   - Normalizes to Car + CarTrim tables.
2. **Pricing Service**
   - Queries MarketCheck for new/used listings by region.
   - Converts all prices to USD using Exchange service.
   - Stores in CarPrice with metadata (source, mileage, etc.).
3. **Country Metrics Service**
   - Aggregates data from WorldBank (GDP, inflation), OECD (wage), Numbeo (cost of living), IMF (forecasts).
   - Persists CountryMetric snapshots daily.
4. **Exchange Service**
   - Fetches hourly rates from provider, caches in Redis + DB fallback.
   - Provides `/api/exchange/rates`, `/api/exchange/live`, `/api/exchange/history`.
5. **Cron Orchestrator**
   - Car catalog refresh: weekly full sync + hourly delta for new years.
   - Pricing refresh: every 2 hours per region.
   - Country metrics refresh: daily.
   - Exchange rates: hourly (or provider limit).

## 4. API Endpoints (v2)
- `GET /api/v2/cars` — paginated list with filters (brand, fuel, drivetrain).
- `GET /api/v2/cars/:id` — detailed car with trims, specs, latest prices, related countries.
- `GET /api/v2/cars/:id/prices?country=US` — price history.
- `GET /api/v2/countries` — list with summary metrics.
- `GET /api/v2/countries/:code` — detailed metrics + purchasing power.
- `GET /api/v2/exchange/latest` — latest rates keyed by currency.
- `POST /api/v2/jobs/trigger` — (auth) manual re-run of ingestion steps.

## 5. Frontend Data Flow
- Replace mock car data with API responses.
- Global state slices:
  - `carSearch` (results + selected car).
  - `currency` (current currency + rates).
  - `country` (selected country metrics).
  - `i18n` (language/RTL flag).
- All price components consume `currency.convert(amountUsd)` to update reactively.
- Car Detail panel uses `/api/v2/cars/:id` payload (image URL, specs). Right column layout with sticky positioning.
- Country panel fetches `/api/v2/countries/:code` with charts (Recharts) for GDP, inflation, wage, PPP.

## 6. Internationalization
- Use `react-i18next` with namespaces `common`, `cars`, `countries`.
- Directory structure: `/src/locales/{en,tr,de,es,ar}/translation.json`.
- Provide RTL-aware components (Tailwind `rtl:` utilities or logical CSS).

## 7. DevOps Notes
- **Env variables:** DB URL, Redis URL, API keys, cron toggles.
- **Deployment:** Backend on Render (or Railway) with worker dyno for jobs; frontend on Vercel.
- **Monitoring:** Health endpoints per service, logging via pino + centralized log drain.
- **Testing:** Unit tests for services, integration tests for API endpoints, mocked external APIs.

---
This plan provides the blueprint for implementing the requested features in manageable phases.
