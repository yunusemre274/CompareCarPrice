// Comprehensive car database with worldwide brands and models
export interface Car {
  name: string;
  brand: string;
  model: string;
  basePrice: number; // USD
  category: string;
}

export const carDatabase: Car[] = [
  // Audi
  { name: "Audi A3", brand: "Audi", model: "A3", basePrice: 35000, category: "Sedan" },
  { name: "Audi A4", brand: "Audi", model: "A4", basePrice: 40500, category: "Sedan" },
  { name: "Audi A6", brand: "Audi", model: "A6", basePrice: 55000, category: "Sedan" },
  { name: "Audi A8", brand: "Audi", model: "A8", basePrice: 87000, category: "Luxury Sedan" },
  { name: "Audi Q3", brand: "Audi", model: "Q3", basePrice: 36000, category: "SUV" },
  { name: "Audi Q5", brand: "Audi", model: "Q5", basePrice: 45000, category: "SUV" },
  { name: "Audi Q7", brand: "Audi", model: "Q7", basePrice: 58000, category: "SUV" },
  { name: "Audi e-tron", brand: "Audi", model: "e-tron", basePrice: 65000, category: "Electric SUV" },
  
  // BMW
  { name: "BMW 1 Series", brand: "BMW", model: "1 Series", basePrice: 35000, category: "Hatchback" },
  { name: "BMW 2 Series", brand: "BMW", model: "2 Series", basePrice: 38000, category: "Coupe" },
  { name: "BMW 3 Series", brand: "BMW", model: "3 Series", basePrice: 43800, category: "Sedan" },
  { name: "BMW 4 Series", brand: "BMW", model: "4 Series", basePrice: 48000, category: "Coupe" },
  { name: "BMW 5 Series", brand: "BMW", model: "5 Series", basePrice: 55000, category: "Sedan" },
  { name: "BMW 7 Series", brand: "BMW", model: "7 Series", basePrice: 92000, category: "Luxury Sedan" },
  { name: "BMW X1", brand: "BMW", model: "X1", basePrice: 37000, category: "SUV" },
  { name: "BMW X3", brand: "BMW", model: "X3", basePrice: 45000, category: "SUV" },
  { name: "BMW X5", brand: "BMW", model: "X5", basePrice: 61000, category: "SUV" },
  { name: "BMW X7", brand: "BMW", model: "X7", basePrice: 78000, category: "Luxury SUV" },
  { name: "BMW i4", brand: "BMW", model: "i4", basePrice: 56000, category: "Electric Sedan" },
  { name: "BMW iX", brand: "BMW", model: "iX", basePrice: 85000, category: "Electric SUV" },
  
  // Mercedes-Benz
  { name: "Mercedes A-Class", brand: "Mercedes-Benz", model: "A-Class", basePrice: 36000, category: "Sedan" },
  { name: "Mercedes C-Class", brand: "Mercedes-Benz", model: "C-Class", basePrice: 44600, category: "Sedan" },
  { name: "Mercedes E-Class", brand: "Mercedes-Benz", model: "E-Class", basePrice: 58000, category: "Sedan" },
  { name: "Mercedes S-Class", brand: "Mercedes-Benz", model: "S-Class", basePrice: 115000, category: "Luxury Sedan" },
  { name: "Mercedes GLA", brand: "Mercedes-Benz", model: "GLA", basePrice: 38000, category: "SUV" },
  { name: "Mercedes GLC", brand: "Mercedes-Benz", model: "GLC", basePrice: 47000, category: "SUV" },
  { name: "Mercedes GLE", brand: "Mercedes-Benz", model: "GLE", basePrice: 59000, category: "SUV" },
  { name: "Mercedes GLS", brand: "Mercedes-Benz", model: "GLS", basePrice: 78000, category: "Luxury SUV" },
  { name: "Mercedes EQS", brand: "Mercedes-Benz", model: "EQS", basePrice: 105000, category: "Electric Sedan" },
  
  // Toyota
  { name: "Toyota Corolla", brand: "Toyota", model: "Corolla", basePrice: 22000, category: "Sedan" },
  { name: "Toyota Camry", brand: "Toyota", model: "Camry", basePrice: 28400, category: "Sedan" },
  { name: "Toyota RAV4", brand: "Toyota", model: "RAV4", basePrice: 29000, category: "SUV" },
  { name: "Toyota Highlander", brand: "Toyota", model: "Highlander", basePrice: 38000, category: "SUV" },
  { name: "Toyota Land Cruiser", brand: "Toyota", model: "Land Cruiser", basePrice: 88000, category: "SUV" },
  { name: "Toyota Prius", brand: "Toyota", model: "Prius", basePrice: 28000, category: "Hybrid" },
  { name: "Toyota Tacoma", brand: "Toyota", model: "Tacoma", basePrice: 30000, category: "Truck" },
  { name: "Toyota Tundra", brand: "Toyota", model: "Tundra", basePrice: 41000, category: "Truck" },
  
  // Honda
  { name: "Honda Civic", brand: "Honda", model: "Civic", basePrice: 24650, category: "Sedan" },
  { name: "Honda Accord", brand: "Honda", model: "Accord", basePrice: 28000, category: "Sedan" },
  { name: "Honda CR-V", brand: "Honda", model: "CR-V", basePrice: 30000, category: "SUV" },
  { name: "Honda Pilot", brand: "Honda", model: "Pilot", basePrice: 40000, category: "SUV" },
  { name: "Honda HR-V", brand: "Honda", model: "HR-V", basePrice: 24000, category: "SUV" },
  
  // Ford
  { name: "Ford Mustang", brand: "Ford", model: "Mustang", basePrice: 30000, category: "Coupe" },
  { name: "Ford F-150", brand: "Ford", model: "F-150", basePrice: 36575, category: "Truck" },
  { name: "Ford Explorer", brand: "Ford", model: "Explorer", basePrice: 37000, category: "SUV" },
  { name: "Ford Escape", brand: "Ford", model: "Escape", basePrice: 29000, category: "SUV" },
  { name: "Ford Bronco", brand: "Ford", model: "Bronco", basePrice: 38000, category: "SUV" },
  { name: "Ford Edge", brand: "Ford", model: "Edge", basePrice: 39000, category: "SUV" },
  
  // Chevrolet
  { name: "Chevrolet Malibu", brand: "Chevrolet", model: "Malibu", basePrice: 26000, category: "Sedan" },
  { name: "Chevrolet Camaro", brand: "Chevrolet", model: "Camaro", basePrice: 28000, category: "Coupe" },
  { name: "Chevrolet Silverado", brand: "Chevrolet", model: "Silverado", basePrice: 35000, category: "Truck" },
  { name: "Chevrolet Equinox", brand: "Chevrolet", model: "Equinox", basePrice: 29000, category: "SUV" },
  { name: "Chevrolet Tahoe", brand: "Chevrolet", model: "Tahoe", basePrice: 54000, category: "SUV" },
  
  // Tesla
  { name: "Tesla Model 3", brand: "Tesla", model: "Model 3", basePrice: 38990, category: "Electric Sedan" },
  { name: "Tesla Model S", brand: "Tesla", model: "Model S", basePrice: 75000, category: "Electric Sedan" },
  { name: "Tesla Model X", brand: "Tesla", model: "Model X", basePrice: 80000, category: "Electric SUV" },
  { name: "Tesla Model Y", brand: "Tesla", model: "Model Y", basePrice: 45000, category: "Electric SUV" },
  
  // Volkswagen
  { name: "Volkswagen Golf", brand: "Volkswagen", model: "Golf", basePrice: 30050, category: "Hatchback" },
  { name: "Volkswagen Jetta", brand: "Volkswagen", model: "Jetta", basePrice: 21000, category: "Sedan" },
  { name: "Volkswagen Passat", brand: "Volkswagen", model: "Passat", basePrice: 25000, category: "Sedan" },
  { name: "Volkswagen Tiguan", brand: "Volkswagen", model: "Tiguan", basePrice: 28000, category: "SUV" },
  { name: "Volkswagen Atlas", brand: "Volkswagen", model: "Atlas", basePrice: 35000, category: "SUV" },
  { name: "Volkswagen ID.4", brand: "Volkswagen", model: "ID.4", basePrice: 42000, category: "Electric SUV" },
  
  // Hyundai
  { name: "Hyundai Elantra", brand: "Hyundai", model: "Elantra", basePrice: 21900, category: "Sedan" },
  { name: "Hyundai Sonata", brand: "Hyundai", model: "Sonata", basePrice: 26000, category: "Sedan" },
  { name: "Hyundai Tucson", brand: "Hyundai", model: "Tucson", basePrice: 28000, category: "SUV" },
  { name: "Hyundai Santa Fe", brand: "Hyundai", model: "Santa Fe", basePrice: 33000, category: "SUV" },
  { name: "Hyundai Palisade", brand: "Hyundai", model: "Palisade", basePrice: 37000, category: "SUV" },
  { name: "Hyundai Ioniq 5", brand: "Hyundai", model: "Ioniq 5", basePrice: 42000, category: "Electric SUV" },
  
  // Kia
  { name: "Kia Forte", brand: "Kia", model: "Forte", basePrice: 20000, category: "Sedan" },
  { name: "Kia K5", brand: "Kia", model: "K5", basePrice: 25000, category: "Sedan" },
  { name: "Kia Sportage", brand: "Kia", model: "Sportage", basePrice: 27000, category: "SUV" },
  { name: "Kia Sorento", brand: "Kia", model: "Sorento", basePrice: 31000, category: "SUV" },
  { name: "Kia Telluride", brand: "Kia", model: "Telluride", basePrice: 36000, category: "SUV" },
  { name: "Kia EV6", brand: "Kia", model: "EV6", basePrice: 43000, category: "Electric SUV" },
  
  // Mazda
  { name: "Mazda3", brand: "Mazda", model: "3", basePrice: 23000, category: "Sedan" },
  { name: "Mazda6", brand: "Mazda", model: "6", basePrice: 26000, category: "Sedan" },
  { name: "Mazda CX-5", brand: "Mazda", model: "CX-5", basePrice: 29200, category: "SUV" },
  { name: "Mazda CX-9", brand: "Mazda", model: "CX-9", basePrice: 38000, category: "SUV" },
  { name: "Mazda MX-5 Miata", brand: "Mazda", model: "MX-5 Miata", basePrice: 28000, category: "Roadster" },
  
  // Nissan
  { name: "Nissan Altima", brand: "Nissan", model: "Altima", basePrice: 26000, category: "Sedan" },
  { name: "Nissan Maxima", brand: "Nissan", model: "Maxima", basePrice: 38000, category: "Sedan" },
  { name: "Nissan Rogue", brand: "Nissan", model: "Rogue", basePrice: 28000, category: "SUV" },
  { name: "Nissan Murano", brand: "Nissan", model: "Murano", basePrice: 34000, category: "SUV" },
  { name: "Nissan Pathfinder", brand: "Nissan", model: "Pathfinder", basePrice: 36000, category: "SUV" },
  { name: "Nissan Leaf", brand: "Nissan", model: "Leaf", basePrice: 29000, category: "Electric" },
  { name: "Nissan Ariya", brand: "Nissan", model: "Ariya", basePrice: 44000, category: "Electric SUV" },
  
  // Subaru
  { name: "Subaru Impreza", brand: "Subaru", model: "Impreza", basePrice: 21000, category: "Sedan" },
  { name: "Subaru Legacy", brand: "Subaru", model: "Legacy", basePrice: 25000, category: "Sedan" },
  { name: "Subaru Outback", brand: "Subaru", model: "Outback", basePrice: 29000, category: "SUV" },
  { name: "Subaru Forester", brand: "Subaru", model: "Forester", basePrice: 27000, category: "SUV" },
  { name: "Subaru Ascent", brand: "Subaru", model: "Ascent", basePrice: 35000, category: "SUV" },
  
  // Lexus
  { name: "Lexus IS", brand: "Lexus", model: "IS", basePrice: 42000, category: "Sedan" },
  { name: "Lexus ES", brand: "Lexus", model: "ES", basePrice: 42000, category: "Sedan" },
  { name: "Lexus GS", brand: "Lexus", model: "GS", basePrice: 52000, category: "Sedan" },
  { name: "Lexus LS", brand: "Lexus", model: "LS", basePrice: 77000, category: "Luxury Sedan" },
  { name: "Lexus NX", brand: "Lexus", model: "NX", basePrice: 41000, category: "SUV" },
  { name: "Lexus RX", brand: "Lexus", model: "RX", basePrice: 48000, category: "SUV" },
  { name: "Lexus GX", brand: "Lexus", model: "GX", basePrice: 59000, category: "SUV" },
  { name: "Lexus LX", brand: "Lexus", model: "LX", basePrice: 91000, category: "Luxury SUV" },
  
  // Porsche
  { name: "Porsche 911", brand: "Porsche", model: "911", basePrice: 107000, category: "Sports Car" },
  { name: "Porsche Cayenne", brand: "Porsche", model: "Cayenne", basePrice: 72000, category: "Luxury SUV" },
  { name: "Porsche Macan", brand: "Porsche", model: "Macan", basePrice: 58000, category: "Luxury SUV" },
  { name: "Porsche Panamera", brand: "Porsche", model: "Panamera", basePrice: 92000, category: "Luxury Sedan" },
  { name: "Porsche Taycan", brand: "Porsche", model: "Taycan", basePrice: 87000, category: "Electric Sedan" },
  
  // Volvo
  { name: "Volvo S60", brand: "Volvo", model: "S60", basePrice: 41000, category: "Sedan" },
  { name: "Volvo S90", brand: "Volvo", model: "S90", basePrice: 54000, category: "Sedan" },
  { name: "Volvo XC40", brand: "Volvo", model: "XC40", basePrice: 35000, category: "SUV" },
  { name: "Volvo XC60", brand: "Volvo", model: "XC60", basePrice: 45000, category: "SUV" },
  { name: "Volvo XC90", brand: "Volvo", model: "XC90", basePrice: 54000, category: "Luxury SUV" },
  
  // Jaguar
  { name: "Jaguar XE", brand: "Jaguar", model: "XE", basePrice: 42000, category: "Sedan" },
  { name: "Jaguar XF", brand: "Jaguar", model: "XF", basePrice: 48000, category: "Sedan" },
  { name: "Jaguar F-PACE", brand: "Jaguar", model: "F-PACE", basePrice: 52000, category: "SUV" },
  { name: "Jaguar I-PACE", brand: "Jaguar", model: "I-PACE", basePrice: 72000, category: "Electric SUV" },
  
  // Land Rover
  { name: "Land Rover Discovery", brand: "Land Rover", model: "Discovery", basePrice: 57000, category: "SUV" },
  { name: "Land Rover Defender", brand: "Land Rover", model: "Defender", basePrice: 55000, category: "SUV" },
  { name: "Land Rover Range Rover", brand: "Land Rover", model: "Range Rover", basePrice: 95000, category: "Luxury SUV" },
  { name: "Land Rover Range Rover Sport", brand: "Land Rover", model: "Range Rover Sport", basePrice: 73000, category: "Luxury SUV" },
  
  // Jeep
  { name: "Jeep Wrangler", brand: "Jeep", model: "Wrangler", basePrice: 32000, category: "SUV" },
  { name: "Jeep Grand Cherokee", brand: "Jeep", model: "Grand Cherokee", basePrice: 40000, category: "SUV" },
  { name: "Jeep Cherokee", brand: "Jeep", model: "Cherokee", basePrice: 30000, category: "SUV" },
  { name: "Jeep Compass", brand: "Jeep", model: "Compass", basePrice: 28000, category: "SUV" },
  
  // Dodge
  { name: "Dodge Charger", brand: "Dodge", model: "Charger", basePrice: 33000, category: "Sedan" },
  { name: "Dodge Challenger", brand: "Dodge", model: "Challenger", basePrice: 32000, category: "Coupe" },
  { name: "Dodge Durango", brand: "Dodge", model: "Durango", basePrice: 37000, category: "SUV" },
  
  // Ram
  { name: "Ram 1500", brand: "Ram", model: "1500", basePrice: 38000, category: "Truck" },
  { name: "Ram 2500", brand: "Ram", model: "2500", basePrice: 42000, category: "Truck" },
  
  // GMC
  { name: "GMC Sierra", brand: "GMC", model: "Sierra", basePrice: 37000, category: "Truck" },
  { name: "GMC Terrain", brand: "GMC", model: "Terrain", basePrice: 29000, category: "SUV" },
  { name: "GMC Acadia", brand: "GMC", model: "Acadia", basePrice: 36000, category: "SUV" },
  { name: "GMC Yukon", brand: "GMC", model: "Yukon", basePrice: 55000, category: "SUV" },
  
  // Cadillac
  { name: "Cadillac CT4", brand: "Cadillac", model: "CT4", basePrice: 36000, category: "Sedan" },
  { name: "Cadillac CT5", brand: "Cadillac", model: "CT5", basePrice: 39000, category: "Sedan" },
  { name: "Cadillac Escalade", brand: "Cadillac", model: "Escalade", basePrice: 81000, category: "Luxury SUV" },
  { name: "Cadillac XT4", brand: "Cadillac", model: "XT4", basePrice: 37000, category: "SUV" },
  { name: "Cadillac XT5", brand: "Cadillac", model: "XT5", basePrice: 44000, category: "SUV" },
  
  // Acura
  { name: "Acura ILX", brand: "Acura", model: "ILX", basePrice: 29000, category: "Sedan" },
  { name: "Acura TLX", brand: "Acura", model: "TLX", basePrice: 40000, category: "Sedan" },
  { name: "Acura MDX", brand: "Acura", model: "MDX", basePrice: 49000, category: "SUV" },
  { name: "Acura RDX", brand: "Acura", model: "RDX", basePrice: 42000, category: "SUV" },
  
  // Infiniti
  { name: "Infiniti Q50", brand: "Infiniti", model: "Q50", basePrice: 42000, category: "Sedan" },
  { name: "Infiniti Q60", brand: "Infiniti", model: "Q60", basePrice: 44000, category: "Coupe" },
  { name: "Infiniti QX50", brand: "Infiniti", model: "QX50", basePrice: 40000, category: "SUV" },
  { name: "Infiniti QX60", brand: "Infiniti", model: "QX60", basePrice: 48000, category: "SUV" },
  
  // Genesis
  { name: "Genesis G70", brand: "Genesis", model: "G70", basePrice: 41000, category: "Sedan" },
  { name: "Genesis G80", brand: "Genesis", model: "G80", basePrice: 50000, category: "Sedan" },
  { name: "Genesis G90", brand: "Genesis", model: "G90", basePrice: 75000, category: "Luxury Sedan" },
  { name: "Genesis GV70", brand: "Genesis", model: "GV70", basePrice: 43000, category: "SUV" },
  { name: "Genesis GV80", brand: "Genesis", model: "GV80", basePrice: 55000, category: "Luxury SUV" },
  
  // Mini
  { name: "Mini Cooper", brand: "Mini", model: "Cooper", basePrice: 28000, category: "Hatchback" },
  { name: "Mini Countryman", brand: "Mini", model: "Countryman", basePrice: 32000, category: "SUV" },
  { name: "Mini Clubman", brand: "Mini", model: "Clubman", basePrice: 30000, category: "Wagon" },
  
  // Fiat
  { name: "Fiat 500", brand: "Fiat", model: "500", basePrice: 18000, category: "Hatchback" },
  { name: "Fiat 500X", brand: "Fiat", model: "500X", basePrice: 25000, category: "SUV" },
  
  // Alfa Romeo
  { name: "Alfa Romeo Giulia", brand: "Alfa Romeo", model: "Giulia", basePrice: 45000, category: "Sedan" },
  { name: "Alfa Romeo Stelvio", brand: "Alfa Romeo", model: "Stelvio", basePrice: 47000, category: "SUV" },
  
  // Maserati
  { name: "Maserati Ghibli", brand: "Maserati", model: "Ghibli", basePrice: 75000, category: "Luxury Sedan" },
  { name: "Maserati Quattroporte", brand: "Maserati", model: "Quattroporte", basePrice: 106000, category: "Luxury Sedan" },
  { name: "Maserati Levante", brand: "Maserati", model: "Levante", basePrice: 82000, category: "Luxury SUV" },
  
  // Ferrari
  { name: "Ferrari Roma", brand: "Ferrari", model: "Roma", basePrice: 222000, category: "Sports Car" },
  { name: "Ferrari F8 Tributo", brand: "Ferrari", model: "F8 Tributo", basePrice: 283000, category: "Sports Car" },
  { name: "Ferrari SF90", brand: "Ferrari", model: "SF90", basePrice: 507000, category: "Sports Car" },
  
  // Lamborghini
  { name: "Lamborghini Huracan", brand: "Lamborghini", model: "Huracan", basePrice: 218000, category: "Sports Car" },
  { name: "Lamborghini Urus", brand: "Lamborghini", model: "Urus", basePrice: 229000, category: "Luxury SUV" },
  { name: "Lamborghini Aventador", brand: "Lamborghini", model: "Aventador", basePrice: 421000, category: "Sports Car" },
  
  // Bentley
  { name: "Bentley Continental GT", brand: "Bentley", model: "Continental GT", basePrice: 236000, category: "Luxury Coupe" },
  { name: "Bentley Flying Spur", brand: "Bentley", model: "Flying Spur", basePrice: 219000, category: "Luxury Sedan" },
  { name: "Bentley Bentayga", brand: "Bentley", model: "Bentayga", basePrice: 182000, category: "Luxury SUV" },
  
  // Rolls-Royce
  { name: "Rolls-Royce Ghost", brand: "Rolls-Royce", model: "Ghost", basePrice: 350000, category: "Luxury Sedan" },
  { name: "Rolls-Royce Phantom", brand: "Rolls-Royce", model: "Phantom", basePrice: 460000, category: "Luxury Sedan" },
  { name: "Rolls-Royce Cullinan", brand: "Rolls-Royce", model: "Cullinan", basePrice: 350000, category: "Luxury SUV" },
  
  // Aston Martin
  { name: "Aston Martin DB11", brand: "Aston Martin", model: "DB11", basePrice: 215000, category: "Sports Car" },
  { name: "Aston Martin Vantage", brand: "Aston Martin", model: "Vantage", basePrice: 144000, category: "Sports Car" },
  { name: "Aston Martin DBX", brand: "Aston Martin", model: "DBX", basePrice: 180000, category: "Luxury SUV" },
  
  // McLaren
  { name: "McLaren GT", brand: "McLaren", model: "GT", basePrice: 215000, category: "Sports Car" },
  { name: "McLaren 720S", brand: "McLaren", model: "720S", basePrice: 310000, category: "Sports Car" },
  
  // Bugatti
  { name: "Bugatti Chiron", brand: "Bugatti", model: "Chiron", basePrice: 3000000, category: "Hypercar" },
];

// Sort car database alphabetically by name
carDatabase.sort((a, b) => a.name.localeCompare(b.name));

// Helper function to search cars
export const searchCars = (query: string, limit: number = 5): Car[] => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  // Filter cars that match the query
  const filtered = carDatabase.filter(car =>
    car.name.toLowerCase().includes(lowerQuery) ||
    car.brand.toLowerCase().includes(lowerQuery) ||
    car.model.toLowerCase().includes(lowerQuery)
  );
  
  // Sort alphabetically and return top results
  return filtered
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
};

// Helper function to get car by exact name
export const getCarByName = (name: string): Car | undefined => {
  return carDatabase.find(car => car.name.toLowerCase() === name.toLowerCase());
};

// Get all unique brands
export const getAllBrands = (): string[] => {
  const brands = [...new Set(carDatabase.map(car => car.brand))];
  return brands.sort();
};

// Get cars by brand
export const getCarsByBrand = (brand: string): Car[] => {
  return carDatabase.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
};
