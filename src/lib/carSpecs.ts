export interface CarSpecs {
  torque: string;
  maxSpeed: string;
  fuelType: string;
  transmission: string;
  horsepower: string;
  origin: string;
}

const defaultSpecs = (brand: string): CarSpecs => ({
  torque: "350 Nm",
  maxSpeed: "210 km/h",
  fuelType: "Petrol",
  transmission: "Automatic",
  horsepower: "250 HP",
  origin: brand ? `${brand} HQ` : "Global",
});

const specsDictionary: Record<string, CarSpecs> = {
  "Toyota Camry": {
    torque: "267 Nm",
    maxSpeed: "210 km/h",
    fuelType: "Hybrid/Petrol",
    transmission: "8-speed Automatic",
    horsepower: "208 HP",
    origin: "Japan",
  },
  "Toyota Corolla": {
    torque: "190 Nm",
    maxSpeed: "195 km/h",
    fuelType: "Petrol",
    transmission: "CVT",
    horsepower: "169 HP",
    origin: "Japan",
  },
  "BMW 3 Series": {
    torque: "400 Nm",
    maxSpeed: "250 km/h",
    fuelType: "Petrol",
    transmission: "8-speed Automatic",
    horsepower: "255 HP",
    origin: "Germany",
  },
  "BMW 320i": {
    torque: "300 Nm",
    maxSpeed: "235 km/h",
    fuelType: "Petrol",
    transmission: "8-speed Automatic",
    horsepower: "181 HP",
    origin: "Germany",
  },
  "Mercedes C-Class": {
    torque: "400 Nm",
    maxSpeed: "250 km/h",
    fuelType: "Mild Hybrid",
    transmission: "9G-TRONIC",
    horsepower: "255 HP",
    origin: "Germany",
  },
  "Tesla Model 3": {
    torque: "493 Nm",
    maxSpeed: "225 km/h",
    fuelType: "Electric",
    transmission: "Single speed",
    horsepower: "271 HP",
    origin: "United States",
  },
  "Tesla Model Y": {
    torque: "493 Nm",
    maxSpeed: "217 km/h",
    fuelType: "Electric",
    transmission: "Single speed",
    horsepower: "384 HP",
    origin: "United States",
  },
  "Honda Civic": {
    torque: "240 Nm",
    maxSpeed: "220 km/h",
    fuelType: "Petrol",
    transmission: "CVT",
    horsepower: "180 HP",
    origin: "Japan",
  },
  "Ford F-150": {
    torque: "651 Nm",
    maxSpeed: "170 km/h",
    fuelType: "Petrol",
    transmission: "10-speed Automatic",
    horsepower: "400 HP",
    origin: "United States",
  },
  "Mercedes GLC": {
    torque: "400 Nm",
    maxSpeed: "240 km/h",
    fuelType: "Mild Hybrid",
    transmission: "9G-TRONIC",
    horsepower: "255 HP",
    origin: "Germany",
  },
  "Audi A4": {
    torque: "370 Nm",
    maxSpeed: "250 km/h",
    fuelType: "Petrol",
    transmission: "7-speed S tronic",
    horsepower: "261 HP",
    origin: "Germany",
  },
};

export function getCarSpecs(name: string, brand?: string): CarSpecs {
  return specsDictionary[name] ?? defaultSpecs(brand || "");
}
