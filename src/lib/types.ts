// Tipos de dominio de la app

export type MealType = "desayuno" | "comida" | "cena" | "snacks";

export const MEALS: { id: MealType; label: string; icon: string }[] = [
  { id: "desayuno", label: "Desayuno", icon: "🌅" },
  { id: "comida", label: "Comida", icon: "🍽️" },
  { id: "cena", label: "Cena", icon: "🌙" },
  { id: "snacks", label: "Snacks", icon: "🍎" },
];

// Método de cocción con el que se pesa el alimento (afecta a los macros por 100 g)
export type CookingMethod =
  | "natural"
  | "crudo"
  | "cocido"
  | "plancha"
  | "horno"
  | "frito"
  | "vapor";

export const COOKING: { id: CookingMethod; label: string; icon: string }[] = [
  { id: "natural", label: "Natural", icon: "🥗" },
  { id: "crudo", label: "Crudo", icon: "🥩" },
  { id: "cocido", label: "Cocido", icon: "🍲" },
  { id: "plancha", label: "Plancha", icon: "🔥" },
  { id: "horno", label: "Horno", icon: "🥖" },
  { id: "frito", label: "Frito", icon: "🍳" },
  { id: "vapor", label: "Vapor", icon: "💨" },
];

export function cookingMeta(id?: CookingMethod) {
  return COOKING.find((c) => c.id === id);
}

// Los macros se almacenan siempre por 100 g (o por 100 ml) del alimento.
// Para alimentos "por unidad" (ej. 1 huevo) se usa gramsPerUnit.
export interface Food {
  id: string;
  name: string;
  brand?: string;
  // valores por 100 g
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // método de cocción con el que se pesa (crudo, cocido, plancha…)
  cooking?: CookingMethod;
  // si el alimento se cuenta en unidades, cuántos gramos pesa 1 unidad
  gramsPerUnit?: number;
  custom?: boolean; // true si lo creó el usuario
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealType;
  foodId: string;
  // snapshot del alimento por si se edita/borra el original
  foodName: string;
  grams: number; // cantidad consumida en gramos
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // kg
}

export interface Targets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Profile {
  name: string;
  sex?: "male" | "female";
  age?: number;
  heightCm: number;
  activity?:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active";
  startWeight: number;
  goalWeight: number;
}

export interface AppData {
  version: number;
  profile: Profile;
  targets: Targets;
  foods: Food[]; // solo alimentos personalizados del usuario
  diary: DiaryEntry[];
  weights: WeightEntry[];
}
