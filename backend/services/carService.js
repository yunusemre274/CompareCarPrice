/**
 * Mock Car Price Service
 * This service returns mock car prices for demonstration
 * Replace this with real car price APIs when available
 */

/**
 * Mock car database with realistic prices
 */
const MOCK_CAR_DATABASE = {
  'toyota camry': {
    name: 'Toyota Camry',
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    category: 'Sedan',
    base_price_usd: 28400,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
  },
  'honda civic': {
    name: 'Honda Civic',
    brand: 'Honda',
    model: 'Civic',
    year: 2024,
    category: 'Sedan',
    base_price_usd: 24650,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
  },
  'ford f-150': {
    name: 'Ford F-150',
    brand: 'Ford',
    model: 'F-150',
    year: 2024,
    category: 'Truck',
    base_price_usd: 36575,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'
  },
  'tesla model 3': {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    category: 'Electric',
    base_price_usd: 38990,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400'
  },
  'bmw 3 series': {
    name: 'BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    year: 2024,
    category: 'Luxury Sedan',
    base_price_usd: 43800,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'
  },
  'mercedes c-class': {
    name: 'Mercedes-Benz C-Class',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2024,
    category: 'Luxury Sedan',
    base_price_usd: 44600,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'
  },
  'volkswagen golf': {
    name: 'Volkswagen Golf',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2024,
    category: 'Hatchback',
    base_price_usd: 30050,
    image: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=400'
  },
  'audi a4': {
    name: 'Audi A4',
    brand: 'Audi',
    model: 'A4',
    year: 2024,
    category: 'Luxury Sedan',
    base_price_usd: 40500,
    image: 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=400'
  },
  'hyundai elantra': {
    name: 'Hyundai Elantra',
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2024,
    category: 'Sedan',
    base_price_usd: 21900,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'
  },
  'mazda cx-5': {
    name: 'Mazda CX-5',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2024,
    category: 'SUV',
    base_price_usd: 29200,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400'
  }
};

/**
 * Mock tax rates by country (percentage)
 */
const MOCK_TAX_RATES = {
  US: 0.07,    // 7% sales tax (average)
  GB: 0.20,    // 20% VAT
  DE: 0.19,    // 19% VAT
  FR: 0.20,    // 20% VAT
  JP: 0.10,    // 10% consumption tax
  CN: 0.13,    // 13% VAT
  IN: 0.28,    // 28% GST on cars
  BR: 0.35,    // ~35% combined taxes
  TR: 0.80,    // ~80% SCT + VAT (very high!)
  AU: 0.10,    // 10% GST
  CA: 0.13,    // 13% HST (Ontario average)
  IT: 0.22,    // 22% VAT
  ES: 0.21,    // 21% VAT
  MX: 0.16,    // 16% VAT
  KR: 0.10,    // 10% VAT
  SE: 0.25,    // 25% VAT
  NO: 0.25,    // 25% VAT
  DK: 0.25,    // 25% VAT
  NL: 0.21,    // 21% VAT
  BE: 0.21     // 21% VAT
};

/**
 * Get car information by name
 * @param {string} carName - Name of the car (e.g., "Toyota Camry")
 */
export const getCarByName = async (carName) => {
  const normalizedName = carName.toLowerCase().trim();
  
  // Try exact match
  let car = MOCK_CAR_DATABASE[normalizedName];
  
  // Try partial match
  if (!car) {
    const matches = Object.keys(MOCK_CAR_DATABASE).filter(key => 
      key.includes(normalizedName) || normalizedName.includes(key)
    );
    
    if (matches.length > 0) {
      car = MOCK_CAR_DATABASE[matches[0]];
    }
  }
  
  // If still not found, generate dynamic car data based on the name
  if (!car) {
    // Extract brand and model from the car name
    const parts = carName.split(' ');
    const brand = parts[0] || 'Unknown';
    const model = parts.slice(1).join(' ') || 'Model';
    
    // Generate a reasonable base price based on brand
    const premiumBrands = ['Mercedes', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Porsche', 'Ferrari', 'Lamborghini', 'Bentley', 'Rolls-Royce', 'Aston', 'McLaren', 'Bugatti', 'Maserati'];
    const luxuryBrands = ['Cadillac', 'Genesis', 'Infiniti', 'Acura', 'Volvo', 'Jaguar', 'Land Rover'];
    const midRangeBrands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Hyundai', 'Kia', 'Volkswagen', 'Subaru'];
    
    let basePrice = 30000; // Default price
    
    if (premiumBrands.some(pb => brand.includes(pb))) {
      basePrice = Math.floor(Math.random() * 100000) + 80000; // $80k-$180k
    } else if (luxuryBrands.some(lb => brand.includes(lb))) {
      basePrice = Math.floor(Math.random() * 30000) + 40000; // $40k-$70k
    } else if (midRangeBrands.some(mb => brand.includes(mb))) {
      basePrice = Math.floor(Math.random() * 20000) + 20000; // $20k-$40k
    }
    
    car = {
      name: carName,
      brand: brand,
      model: model,
      year: 2024,
      category: 'Sedan',
      base_price_usd: basePrice,
      image: `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400`
    };
  }
  
  return {
    ...car,
    last_updated: new Date().toISOString(),
    source: 'mock_database'
  };
};

/**
 * Get car price for a specific country
 * @param {string} carName - Name of the car
 * @param {string} countryCode - ISO country code
 */
export const getCarPriceForCountry = async (carName, countryCode) => {
  const car = await getCarByName(carName);
  const taxRate = MOCK_TAX_RATES[countryCode] || 0.20;
  
  const basePriceUSD = car.base_price_usd;
  const taxAmount = basePriceUSD * taxRate;
  const taxedPrice = basePriceUSD + taxAmount;
  
  return {
    car_name: car.name,
    country_code: countryCode,
    base_price_usd: basePriceUSD,
    tax_rate_percentage: taxRate * 100,
    tax_amount_usd: parseFloat(taxAmount.toFixed(2)),
    taxed_price_usd: parseFloat(taxedPrice.toFixed(2)),
    tax_free_price_usd: basePriceUSD,
    last_updated: new Date().toISOString(),
    source: 'mock_database'
  };
};

/**
 * Get all available cars
 */
export const getAllCars = async () => {
  return {
    cars: Object.values(MOCK_CAR_DATABASE),
    total: Object.keys(MOCK_CAR_DATABASE).length,
    last_updated: new Date().toISOString(),
    source: 'mock_database'
  };
};

/**
 * Search cars by brand, model, or category
 * @param {string} query - Search query
 */
export const searchCars = async (query) => {
  const normalizedQuery = query.toLowerCase();
  
  const results = Object.values(MOCK_CAR_DATABASE).filter(car => 
    car.name.toLowerCase().includes(normalizedQuery) ||
    car.brand.toLowerCase().includes(normalizedQuery) ||
    car.model.toLowerCase().includes(normalizedQuery) ||
    car.category.toLowerCase().includes(normalizedQuery)
  );
  
  return {
    cars: results,
    total: results.length,
    query: query,
    last_updated: new Date().toISOString(),
    source: 'mock_database'
  };
};

/**
 * Add a new car to the database (for future API integration)
 * @param {object} carData - Car information
 */
export const addCar = async (carData) => {
  const normalizedName = carData.name.toLowerCase();
  
  MOCK_CAR_DATABASE[normalizedName] = {
    name: carData.name,
    brand: carData.brand,
    model: carData.model,
    year: carData.year || 2024,
    category: carData.category || 'Unknown',
    base_price_usd: carData.base_price_usd,
    image: carData.image || null
  };
  
  return {
    success: true,
    car: MOCK_CAR_DATABASE[normalizedName],
    message: 'Car added successfully'
  };
};

/**
 * Get tax rate for a country
 * @param {string} countryCode - ISO country code
 */
export const getTaxRate = (countryCode) => {
  return MOCK_TAX_RATES[countryCode] || 0.20;
};

/**
 * Calculate equivalent values (real estate, gold, etc.)
 * @param {number} priceUSD - Price in USD
 * @param {string} countryCode - Country code
 */
export const calculateEquivalentValues = (priceUSD, countryCode) => {
  // Average prices (mock data)
  const goldPricePerOz = 2050; // USD per oz
  const goldOunces = priceUSD / goldPricePerOz;
  
  const avgHousePriceUSD = {
    US: 416100,
    GB: 312000,
    DE: 450000,
    FR: 380000,
    JP: 350000,
    CN: 280000,
    IN: 95000,
    BR: 120000,
    TR: 110000,
    AU: 580000
  };
  
  const housePrice = avgHousePriceUSD[countryCode] || 300000;
  const housePercentage = (priceUSD / housePrice) * 100;
  
  return {
    gold_equivalent: {
      ounces: parseFloat(goldOunces.toFixed(2)),
      description: `${goldOunces.toFixed(2)} oz of gold`
    },
    real_estate_equivalent: {
      percentage: parseFloat(housePercentage.toFixed(2)),
      description: `${housePercentage.toFixed(2)}% of average house price`
    },
    electronics_equivalent: {
      iphones: Math.floor(priceUSD / 999),
      description: `${Math.floor(priceUSD / 999)} iPhone 15 Pro`
    }
  };
};

export default {
  getCarByName,
  getCarPriceForCountry,
  getAllCars,
  searchCars,
  addCar,
  getTaxRate,
  calculateEquivalentValues
};
